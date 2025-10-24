const axios = require('axios');
const path = require('path');
const fs = require('fs/promises');
const { checkExchangeInTradingMarkets, addExchange, partialUpdateExchange, upsertExchange } = require('./db');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const base_url = "https://pro-api.coinmarketcap.com/";
const pubic_api_x_request_id = "6a0d6a92-d57a-4c09-8dcc-4f2c4d3c749c";
const api_key = process.env.CMC_API_KEY;
const DATA_DUMP_FILE = 'token_data_dump.json';
const SCRAPE_INTERVAL = 1000 * 60 * 60; // 1 hour in milliseconds
const FOUND_EXCHANGES_FILE = path.join(__dirname, 'data', 'found_exchanges.json');

/**
 * Save found exchanges to JSON file
 * @param {Array} exchanges - Array of found exchanges
 */
async function saveFoundExchanges(exchanges) {
  try {
    const data = {
      lastUpdated: new Date().toISOString(),
      totalExchanges: exchanges.length,
      exchanges: exchanges
    };
    
    await fs.writeFile(FOUND_EXCHANGES_FILE, JSON.stringify(data, null, 2));
    console.log(`Saved ${exchanges.length} exchanges to ${FOUND_EXCHANGES_FILE}`);
  } catch (error) {
    console.error('Error saving found exchanges:', error);
  }
}

/**
 * Load previously found exchanges from JSON file
 * @returns {Array} Previously found exchanges
 */
async function loadFoundExchanges() {
  try {
    const data = await fs.readFile(FOUND_EXCHANGES_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    console.log(`Loaded ${jsonData.exchanges.length} previously found exchanges`);
    return jsonData.exchanges;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No previous found exchanges file exists');
      return [];
    }
    console.error('Error loading found exchanges:', error);
    return [];
  }
}

async function loadAllExchangesFromJson() {
  try {
    console.log('Reading exchanges.json file...');
    const data = await fs.readFile(path.join(__dirname, 'data', 'exchanges.json'), 'utf8');
    const jsonData = JSON.parse(data);
    
    // Load previously found exchanges to avoid rechecking
    const foundExchanges = await loadFoundExchanges();
    const foundExchangeNames = new Set(foundExchanges.map(e => e.name));
    
    // Extract field names and values
    const fields = jsonData.fields;
    const values = jsonData.values;
    const exchanges = [...foundExchanges]; // Start with previously found exchanges
    return exchanges;

    console.log('Processing exchanges...');
    let saveCounter = 0;
    
    for (const exchangeData of values) {
      // Create an object mapping fields to values
      const exchange = {};
      fields.forEach((field, index) => {
        exchange[field] = exchangeData[index];
      });

      // Skip if already found
      if (foundExchangeNames.has(exchange.name)) {
        console.log(`Skipping already found exchange: ${exchange.name}`);
        continue;
      }

      // Check if exchange exists in trading markets
      console.log(`Checking exchange: ${exchange.name}`);
      const isInDB = await checkExchangeInTradingMarkets(exchange.name);
      
      if (isInDB.exists) {
        console.log(`Exchange ${exchange.name} found in trading markets with ${isInDB.count} tokens`);
        const enrichedExchange = {
          ...exchange,
          tradingPairs: isInDB.pairs,
          tokenCount: isInDB.count,
          foundAt: new Date().toISOString()
        };
        exchanges.push(enrichedExchange);
        
        // Save progress every 5 exchanges found
        saveCounter++;
        if (saveCounter % 5 === 0) {
          await saveFoundExchanges(exchanges);
        }
      }
    }

    // Final save
    if (exchanges.length > 0) {
      await saveFoundExchanges(exchanges);
    }

    console.log(`Found ${exchanges.length} total exchanges in trading markets`);
    return exchanges;
  } catch (error) {
    console.error('Error loading exchanges:', error);
    throw error;
  }
}

/**
 * Fetch exchange data from CMC API for given exchange IDs
 * @param {string|number[]} exchange_ids - Array of exchange IDs or comma-separated string (max 100)
 * @returns {Promise<Object>} Exchange data from CMC
 */
async function getExchangesDataFromCMC(exchange_ids = []) {
  try {
    // Handle both array and string inputs
    if (typeof exchange_ids === 'string') {
      exchange_ids = exchange_ids.split(',').map(id => id.trim());
    }

    if (exchange_ids.length === 0) {
      console.log('No exchange IDs provided');
      return null;
    }

    if (exchange_ids.length > 100) {
      console.warn('Warning: More than 100 exchange IDs provided. Only first 100 will be processed.');
      exchange_ids = exchange_ids.slice(0, 100);
    }

    const url = `${base_url}v1/exchange/quotes/latest`;
    const params = {
      id: Array.isArray(exchange_ids) ? exchange_ids.join(',') : exchange_ids
    };
    const headers = {
      'X-CMC_PRO_API_KEY': api_key
    };

    console.log(`Fetching data for ${exchange_ids.length} exchanges from CMC...`);
    const response = await axios.get(url, { params, headers });
    
    if (response.data.status.error_code !== 0) {
      throw new Error(`CMC API Error: ${response.data.status.error_message}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching exchange data from CMC:', error.message);
    throw error;
  }
}

/**
 * Fetch exchange metadata from CMC API
 * @param {string|number[]} exchange_ids - Array of exchange IDs or comma-separated string (max 100)
 * @returns {Promise<Object>} Exchange metadata from CMC
 */
async function getExchangesMetadataFromCMC(exchange_ids = []) {
  try {
    // Handle both array and string inputs
    if (typeof exchange_ids === 'string') {
      exchange_ids = exchange_ids.split(',').map(id => id.trim());
    }

    if (exchange_ids.length === 0) {
      console.log('No exchange IDs provided for metadata');
      return null;
    }

    if (exchange_ids.length > 100) {
      console.warn('Warning: More than 100 exchange IDs provided for metadata. Only first 100 will be processed.');
      exchange_ids = exchange_ids.slice(0, 100);
    }

    const url = `${base_url}v1/exchange/info`;
    const params = {
      id: Array.isArray(exchange_ids) ? exchange_ids.join(',') : exchange_ids
    };
    const headers = {
      'X-CMC_PRO_API_KEY': api_key
    };

    console.log(`Fetching metadata for ${exchange_ids.length} exchanges from CMC...`);
    const response = await axios.get(url, { params, headers });
    
    if (response.data.status.error_code !== 0) {
      throw new Error(`CMC API Error: ${response.data.status.error_message}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching exchange metadata from CMC:', error.message);
    throw error;
  }
}

/**
 * Process and add exchange data from CMC to our database
 * @param {Object} cmcData - Exchange data from CMC API
 * @returns {Promise<Array>} Array of processed exchanges
 */
async function processAndAddCMCExchangeData(cmcData) {
  try {
    if (!cmcData || !cmcData.data) {
      console.log('No CMC data to process');
      return [];
    }

    const processedExchanges = [];
    const exchanges = Object.values(cmcData.data);

    // Sort exchanges by spot volume to determine rank
    // exchanges.sort((a, b) => {
    //   const volumeA = a.quote?.USD?.spot_volume_usd || 0;
    //   const volumeB = b.quote?.USD?.spot_volume_usd || 0;
    //   return volumeB - volumeA;
    // });

    for (let i = 0; i < exchanges.length; i++) {
      const exchange = exchanges[i];
      try {
        const exchangeData = {
          name: exchange.name,
          slug: exchange.slug,
          // description: null,
          // type: '',
          rank: exchange.rank,
          weeklyVisits: exchange.traffic_score * 1000,
          spotVolumeUsd: exchange.quote?.USD?.spot_volume_usd,
          volumeLastUpdated: exchange.quote?.USD?.last_updated ? new Date(exchange.quote.USD.last_updated) : null,
          quote: {
            volume24h: exchange.quote?.USD?.volume_24h,
            volume24hAdjusted: exchange.quote?.USD?.volume_24h_adjusted,
            volume7d: exchange.quote?.USD?.volume_7d,
            volume30d: exchange.quote?.USD?.volume_30d,
            percentChangeVolume24h: exchange.quote?.USD?.percent_change_volume_24h,
            percentChangeVolume7d: exchange.quote?.USD?.percent_change_volume_7d,
            percentChangeVolume30d: exchange.quote?.USD?.percent_change_volume_30d,
            effectiveLiquidity24h: exchange.quote?.USD?.effective_liquidity_24h,
            derivativeVolumeUsd: exchange.quote?.USD?.derivative_volume_usd,
            spotVolumeUsd: exchange.quote?.USD?.spot_volume_usd
          },
          cmcId: exchange.id,
          // urls: {
          //   website: [],
          //   twitter: [],
          //   blog: [],
          //   chat: [],
          //   fee: []
          // }
        };

        // Add the exchange to our database
        const addedExchange = await upsertExchange(exchangeData);
        processedExchanges.push(addedExchange);
        
        console.log(`Added/Updated exchange: ${exchange.name} (Rank: ${i + 1})`);
      } catch (error) {
        console.error(`Error processing exchange ${exchange.name}:`, error.message);
        continue;
      }
    }

    return processedExchanges;
  } catch (error) {
    console.error('Error processing CMC exchange data:', error);
    throw error;
  }
}

async function processExchangeQuotes(exchanges, startIndex = 0, batchSize = 100) {
  console.log('\n=== Processing Exchange Quotes ===\n');
  const totalBatches = Math.ceil((exchanges.length - startIndex) / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = startIndex + (i * batchSize);
    const end = Math.min(start + batchSize, exchanges.length);
    const batch = exchanges.slice(start, end);
    
    console.log(`Processing quotes batch ${i + 1} of ${totalBatches}`);
    console.log(`Processing exchanges from index ${start} to ${end-1}`);
    
    try {
      // Filter out any null/undefined IDs and convert to array
      const exchangeIds = batch.map(e => e.id).filter(Boolean);
      const data = await getExchangesDataFromCMC(exchangeIds);
      await processAndAddCMCExchangeData(data);
    } catch (error) {
      console.error('Error processing exchange quotes:', error);
      // Return the index where it failed so we can resume from here
      return start;
    }
  }
  return exchanges.length;
}

/**
 * Process metadata for a single exchange and update database
 * @param {Object} metadata - Exchange metadata from CMC API
 * @returns {Promise<Object>} Updated exchange data
 */
async function processExchangeMetadataItem(metadata) {
  try {
    if (!metadata) {
      console.log('No metadata to process');
      return null;
    }

    // Prepare exchange data with metadata fields
    const exchangeData = {
      name: metadata.name,
      slug: metadata.slug,
      logo: metadata.logo,
      description: metadata.description,
      dateLaunched: metadata.date_launched ? new Date(metadata.date_launched) : null,
      notice: metadata.notice,
      countries: metadata.countries || [],
      fiats: metadata.fiats || [],
      // tags: metadata.tags?.map(tag => ({
      //   name: tag.name,
      //   slug: tag.slug,
      //   group: tag.group || "PROPERTY" // Default to PROPERTY if group is not provided
      // })) || [],
      tags: [],
      type: metadata.type,
      makerFee: metadata.maker_fee,
      takerFee: metadata.taker_fee,
      weeklyVisits: metadata.weekly_visits,
      spotVolumeUsd: metadata.spot_volume_usd,
      volumeLastUpdated: metadata.volume_last_updated ? new Date(metadata.volume_last_updated) : null,
      urls: {
        website: metadata.urls?.website || [],
        twitter: metadata.urls?.twitter || [],
        blog: metadata.urls?.blog || [],
        chat: metadata.urls?.chat || [],
        fee: metadata.urls?.fee || []
      }
    };

    // Update the exchange in our database
    const updatedExchange = await partialUpdateExchange(exchangeData);
    console.log(`Updated metadata for exchange: ${metadata.name}`);
    return updatedExchange;
  } catch (error) {
    console.error(`Error processing metadata for exchange ${metadata?.name || 'unknown'}:`, error.message);
    throw error;
  }
}

async function processExchangeMetadata(exchanges, startIndex = 0, batchSize = 100) {
  console.log('\n=== Processing Exchange Metadata ===\n');
  const totalBatches = Math.ceil((exchanges.length - startIndex) / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = startIndex + (i * batchSize);
    const end = Math.min(start + batchSize, exchanges.length);
    const batch = exchanges.slice(start, end);
    
    console.log(`Processing metadata batch ${i + 1} of ${totalBatches}`);
    console.log(`Processing exchanges from index ${start} to ${end-1}`);
    
    try {
      const exchangeIds = batch.map(e => e.id).filter(Boolean);
      const data = await getExchangesMetadataFromCMC(exchangeIds);
      
      if (!data || !data.data) {
        console.log('No metadata received from CMC');
        continue;
      }

      // Process each exchange's metadata
      for (const [id, metadata] of Object.entries(data.data)) {
        try {
          await processExchangeMetadataItem(metadata);
        } catch (error) {
          console.error(`Failed to process metadata for exchange ID ${id}:`, error.message);
          continue;
        }
      }
      
      // Add a small delay to respect rate limits
      if (i < totalBatches - 1) {
        console.log('Waiting before processing next batch...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Error processing exchange metadata batch:', error);
      // Return the index where it failed so we can resume from here
      return start;
    }
  }
  return exchanges.length;
}

/**
 * Fetch exchange reserves from CMC API
 * @param {number} exchange_id - Single exchange ID
 * @returns {Promise<Object>} Exchange reserves from CMC
 */
async function getExchangeReservesFromCMC(exchange_id) {
  try {
    const url = `${base_url}v1/exchange/assets`;
    const params = { id: exchange_id };
    const headers = {
      'X-CMC_PRO_API_KEY': api_key
    };

    console.log(`Fetching reserves for exchange ${exchange_id} from CMC...`);
    const response = await axios.get(url, { params, headers });
    
    if (response.data.status.error_code !== 0) {
      throw new Error(`CMC API Error: ${response.data.status.error_message}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching exchange reserves from CMC:', error.message);
    throw error;
  }
}

async function processAndAddReserves(data, exchangeId) {
  if (!data || !data.data) {
    console.log('No reserve data to process');
    return;
  }

  const reserves = data.data;
  let totalValue = 0;

  // Calculate total value in USD and prepare assets for database
  const assets = reserves.map(reserve => {
    const value = reserve.balance * reserve.currency.price_usd;
    totalValue += value;

    return {
      exchangeId,
      walletAddress: reserve.wallet_address,
      balance: reserve.balance,
      platform: {
        cryptoId: reserve.platform.crypto_id,
        symbol: reserve.platform.symbol,
        name: reserve.platform.name
      },
      currency: {
        cryptoId: reserve.currency.crypto_id,
        priceUsd: reserve.currency.price_usd,
        symbol: reserve.currency.symbol,
        name: reserve.currency.name
      }
    };
  });

  try {
    // First delete existing assets for this exchange
    await prisma.exchangeAsset.deleteMany({
      where: { exchangeId }
    });

    // Then create new assets
    await prisma.exchangeAsset.createMany({
      data: assets
    });

    console.log(`Processed ${reserves.length} reserves with total value: $${totalValue.toLocaleString()}`);
    console.log(`Successfully stored ${assets.length} assets in database for exchange ${exchangeId}`);
  } catch (error) {
    console.error('Error storing exchange assets in database:', error);
    throw error;
  }
}

async function processExchangeReserves(exchanges, startIndex = 0, batchSize = 100) {
  console.log('\n=== Processing Exchange Reserves ===\n');
  const totalExchanges = exchanges.length - startIndex;
  
  for (let i = startIndex; i < exchanges.length; i++) {
    const exchange = exchanges[i];
    
    // First check if exchange exists in database
    let dbExchange;
    try {
      dbExchange = await prisma.exchange.findUnique({
        where: { slug: exchange.slug }
      });
      
      if (!dbExchange) {
        console.log(`Exchange ${exchange.name} not found in database, skipping reserves...`);
        continue;
      }
    } catch (error) {
      console.error('Error finding exchange in database:', error);
      return i;
    }
    
    console.log(`Processing reserves for exchange ${i + 1} of ${totalExchanges}`);
    console.log(`Exchange: ${exchange.name} (ID: ${exchange.id})`);
    
    try {
      const data = await getExchangeReservesFromCMC(exchange.id);
      if (!data) continue;
      if (data.data.length === 0) continue;
      await processAndAddReserves(data, dbExchange.id);
      
      // Add a delay between requests to respect rate limits
      if (i < exchanges.length - 1) {
        console.log('Waiting before processing next exchange...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Error processing exchange reserves:', error);
      // Return the index where it failed so we can resume from here
      return i;
    }
  }
  return exchanges.length;
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const startIndex = parseInt(args[0]) || 0;
    const batchSize = parseInt(args[1]) || 100;
    
    console.log('Starting exchange processing...');
    console.log(`Starting from index: ${startIndex}`);
    console.log(`Batch size: ${batchSize}`);
    
    const allExchanges = await loadAllExchangesFromJson();
    
    // Filter out inactive exchanges and those with no trading pairs
    const exchangesToWorkWith = allExchanges.filter(e => 
      e.is_active === 1 && 
      Array.isArray(e.tradingPairs) && 
      e.tradingPairs.length > 0
    );
    
    console.log(`Total exchanges found: ${allExchanges.length}`);
    console.log(`Active exchanges with trading pairs: ${exchangesToWorkWith.length}`);
    console.log(`Skipped ${allExchanges.length - exchangesToWorkWith.length} exchanges (inactive or no trading pairs)`);
    
    // // // First process exchange quotes
    // const quotesEndIndex = await processExchangeQuotes(exchangesToWorkWith, startIndex, batchSize);
    
    // if (quotesEndIndex < exchangesToWorkWith.length) {
    //   console.log(`\nQuotes processing stopped at index ${quotesEndIndex}`);
    //   console.log(`To resume quotes processing, run: node scraper.js ${quotesEndIndex} ${batchSize}`);
    //   return;
    // }
    
    // Then process metadata
    const metadataEndIndex = await processExchangeMetadata(exchangesToWorkWith, startIndex, batchSize);
    
    if (metadataEndIndex < exchangesToWorkWith.length) {
      console.log(`\nMetadata processing stopped at index ${metadataEndIndex}`);
      console.log(`To resume metadata processing, run: node scraper.js ${metadataEndIndex} ${batchSize}`);
      return;
    }

    // // Finally process reserves
    // const reservesEndIndex = await processExchangeReserves(exchangesToWorkWith, startIndex, batchSize);
    
    // if (reservesEndIndex < exchangesToWorkWith.length) {
    //   console.log(`\nReserves processing stopped at index ${reservesEndIndex}`);
    //   console.log(`To resume reserves processing, run: node scraper.js ${reservesEndIndex} ${batchSize}`);
    //   return;
    // }
    
    // Print final statistics
    const stats = {
      totalExchanges: exchangesToWorkWith.length,
      totalTradingPairs: exchangesToWorkWith.reduce((acc, e) => acc + (e.tradingPairs?.length || 0), 0),
      totalTokensCovered: exchangesToWorkWith.reduce((acc, e) => acc + (e.tokenCount || 0), 0),
      averagePairsPerExchange: Math.round(exchangesToWorkWith.reduce((acc, e) => acc + (e.tradingPairs?.length || 0), 0) / exchangesToWorkWith.length)
    };
    
    console.log('\nProcessing completed successfully!');
    console.log('Final Statistics:', stats);
  } catch (error) {
    console.error('Error in main:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

// node scraper.js 234 100 reserves
// Issues to fix 
// Tags in prisma schema they create a deadlock scenario when being inserted.. hence commented