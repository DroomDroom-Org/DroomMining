# DroomETFs API Documentation

This document describes the available API endpoints for interacting with the DroomETFs platform.

## ETF Price Endpoints

The following endpoints allow you to retrieve ETF price data and automatically update the database.

### Main Price Endpoint with Short-term Caching

#### `GET /api/etf/price`

Fetches price data for a single ETF with a short 1-minute Redis cache for performance. This endpoint will still update the database even when serving cached data.

**Query Parameters:**
- `ticker` (required): The ETF ticker symbol (e.g., IBIT, FBTC)
- `updateDb` (optional): Set to 'false' to skip database update (default: true)
- `noCache` (optional): Set to 'true' to bypass the cache and fetch fresh data (default: false)

**Example Request:**
```
GET /api/etf/price?ticker=IBIT
```

**Example Response:**
```json
{
  "ticker": "IBIT",
  "currentPrice": {
    "usd": 53.95,
    "lastUpdated": "2023-06-10T15:30:00.000Z"
  },
  "priceChanges": {
    "day1": 1.25
  },
  "dailyHigh": 54.20,
  "dailyLow": 53.75,
  "openPrice": 53.85,
  "previousClose": 53.29,
  "sourceTimestamp": "2023-06-10T15:30:00.000Z",
  "databaseUpdated": true,
  "apiKeyStats": {
    "enabledKeys": 3,
    "totalCapacity": 180
  }
}
```

#### `POST /api/etf/price`

Fetches price data for multiple ETFs in a single request with 1-minute Redis caching.

**Request Body:**
```json
{
  "tickers": ["IBIT", "FBTC", "EBTC"],
  "updateDb": true,
  "noCache": false
}
```

**Example Response:**
```json
{
  "results": {
    "IBIT": {
      "ticker": "IBIT",
      "currentPrice": {
        "usd": 53.95,
        "lastUpdated": "2023-06-10T15:30:00.000Z"
      },
      "priceChanges": {
        "day1": 1.25
      },
      "dailyHigh": 54.20,
      "dailyLow": 53.75,
      "openPrice": 53.85,
      "previousClose": 53.29,
      "sourceTimestamp": "2023-06-10T15:30:00.000Z"
    },
    "FBTC": {
      // Similar structure for FBTC
    },
    "EBTC": {
      // Similar structure for EBTC
    }
  },
  "timestamp": "2023-06-10T15:30:05.000Z",
  "databaseUpdated": true,
  "apiKeyStats": {
    "enabledKeys": 3,
    "totalCapacity": 180
  }
}
```

### Longer-term Cached Price Endpoint

For applications that need frequent price updates, we provide a cached version of the price API that uses Redis with a longer 5-minute cache duration to reduce load on the Finnhub API and improve performance. Database updates only occur when fresh data is fetched.

#### `GET /api/etf/price/cached`

Fetches price data for a single ETF with extended Redis caching (5-minute default cache).

**Query Parameters:**
- `ticker` (required): The ETF ticker symbol
- `bypass` (optional): Set to 'true' to force a fresh request
- `ttl` (optional): Custom cache TTL in seconds (default: 300)
- `updateDb` (optional): Set to 'false' to skip database update (default: true)

**Example Request:**
```
GET /api/etf/price/cached?ticker=IBIT
```

**Example Response:**
```json
{
  "ticker": "IBIT",
  "currentPrice": {
    "usd": 53.95,
    "lastUpdated": "2023-06-10T15:30:00.000Z"
  },
  "priceChanges": {
    "day1": 1.25
  },
  "dailyHigh": 54.20,
  "dailyLow": 53.75,
  "openPrice": 53.85,
  "previousClose": 53.29,
  "sourceTimestamp": "2023-06-10T15:30:00.000Z",
  "fromCache": true,
  "cache": {
    "ttl": 300,
    "timestamp": 1686411000000,
    "expires": "2023-06-10T15:35:00.000Z"
  },
  "databaseUpdated": false,
  "apiKeyStats": {
    "enabledKeys": 3,
    "totalCapacity": 180
  }
}
```

> **Note:** The `databaseUpdated` field will be `false` when data is served from cache, and `true` when fresh data is fetched (unless `updateDb=false` is specified).

#### `POST /api/etf/price/cached`

Fetches cached price data for multiple ETFs in a single request.

**Request Body:**
```json
{
  "tickers": ["IBIT", "FBTC", "EBTC"],
  "bypassCache": false,
  "ttl": 60,
  "updateDb": true
}
```

**Example Response:**
```json
{
  "results": {
    "IBIT": {
      // Data with fromCache: true/false
    },
    "FBTC": {
      // Data with fromCache: true/false
    },
    "EBTC": {
      // Data with fromCache: true/false
    }
  },
  "timestamp": "2023-06-10T15:30:05.000Z",
  "cache": {
    "enabled": true,
    "ttl": 300,
    "freshFetches": 1
  },
  "databaseUpdateAttempts": 1,
  "apiKeyStats": {
    "enabledKeys": 3,
    "totalCapacity": 180
  }
}
```

## API Key Management

The system automatically manages Finnhub API keys to prevent rate limit issues:

1. **API Key Rotation**: Requests are distributed across multiple Finnhub API keys defined in the environment variables (`FINNHUB_API_KEY`, `FINNHUB_API_KEY_2`, `FINNHUB_API_KEY_3`).

2. **Rate Limit Tracking**: The system tracks usage of each key to ensure we don't exceed the 60 requests per minute limit per key.

3. **Automated Failover**: If a key hits the rate limit, it's automatically marked as unavailable for 60 seconds and the system will use another available key.

4. **Status Information**: All API responses include `apiKeyStats` with information about the current state of the API key pool.

The response field `apiKeyStats` provides information about the current API key pool:

- `enabledKeys`: Number of currently available API keys
- `totalCapacity`: Total number of requests per minute available across all keys (typically 60 per key)

## Redis Caching Details

Both API endpoints use Redis for caching ETF price data:

1. **Main API `/api/etf/price`**:
   - Uses a shorter 1-minute Redis cache for performance
   - Continues to update the database even when serving cached responses
   - Suitable for most applications that need frequent updates
   - Use the `noCache=true` parameter to bypass the cache when needed

2. **Cached API `/api/etf/price/cached`**:
   - Uses a longer 5-minute Redis cache by default
   - Only updates the database when fresh data is fetched
   - Ideal for dashboards and applications with many concurrent users
   - Provides more information about cache status in the response
   - Offers more cache control options (custom TTL, explicit bypass)

Using Redis for caching provides several benefits:
- Caching persists across server restarts
- Cache is shared across all server instances
- Automatic expiration handling
- Reduced Finnhub API usage

## Database Update Details

When the ETF price APIs fetch fresh data, they automatically update the following fields in the database:

- `currentPrice.usd`: The current price of the ETF in USD
- `currentPrice.lastUpdated`: Timestamp when the price was updated
- `priceChanges.day1`: 24-hour percent change
- `priceChanges.lastUpdated`: Timestamp when price changes were updated
- `updatedAt`: General timestamp for the ETF record

These updates happen asynchronously to avoid slowing down the API response. Database updates are skipped when:
1. The ETF ticker isn't found in the database
2. The `updateDb=false` parameter is specified
3. For the cached API, when data is served from cache (unless `bypass=true`)

## Client Usage Examples

### JavaScript/TypeScript

```javascript
// Fetch a single ETF price with database update
async function getEtfPrice(ticker, noCache = false) {
  const response = await fetch(`/api/etf/price?ticker=${ticker}&noCache=${noCache}`);
  return await response.json();
}

// Fetch multiple ETF prices with database update
async function getMultipleEtfPrices(tickers, noCache = false) {
  const response = await fetch('/api/etf/price', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickers, noCache }),
  });
  return await response.json();
}

// Fetch cached price with custom TTL and skip database update
async function getCachedEtfPrice(ticker, ttl = 60, updateDb = false) {
  const response = await fetch(`/api/etf/price/cached?ticker=${ticker}&ttl=${ttl}&updateDb=${updateDb}`);
  return await response.json();
}
```

### Python

```python
import requests

# Fetch a single ETF price
def get_etf_price(ticker, update_db=True, no_cache=False):
    response = requests.get(
        f"https://yourdomain.com/api/etf/price?ticker={ticker}&updateDb={str(update_db).lower()}&noCache={str(no_cache).lower()}"
    )
    return response.json()

# Fetch multiple ETF prices
def get_multiple_etf_prices(tickers, update_db=True, no_cache=False):
    response = requests.post(
        "https://yourdomain.com/api/etf/price",
        json={"tickers": tickers, "updateDb": update_db, "noCache": no_cache}
    )
    return response.json()

# Fetch cached price with bypass option
def get_cached_etf_price(ticker, bypass_cache=False, update_db=True, ttl=None):
    params = {
        "ticker": ticker,
        "bypass": str(bypass_cache).lower(),
        "updateDb": str(update_db).lower()
    }
    
    if ttl is not None:
        params["ttl"] = ttl
        
    response = requests.get(
        "https://yourdomain.com/api/etf/price/cached",
        params=params
    )
    return response.json()
```

## Rate Limiting & Best Practices

Even with the API key rotation system, we recommend following these best practices:

1. **Use the cached endpoints**: The `/api/etf/price/cached` endpoint is optimized for frequent access with its longer cache duration.

2. **Batch requests where possible**: Use the POST endpoints for multiple ETFs rather than making separate calls for each ticker.

3. **Consider your use case**:
   - For UI updates, use the cached endpoint with its default 5-minute cache.
   - For critical operations requiring fresh data, use the main endpoint with `noCache=true`.
   - For less time-sensitive operations, use whichever endpoint with database updates enabled.

4. **Monitor capacity**: Check the `apiKeyStats` in responses to understand your current API capacity.

If you need higher rate limits, consider adding more Finnhub API keys to the environment variables (`FINNHUB_API_KEY_4`, etc.). 