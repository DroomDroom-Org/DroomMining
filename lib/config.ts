export const config = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || ' https://droomdroom.com',
  apiPath: process.env.NEXT_PUBLIC_API_PATH || ' https://droomdroom.com/api',
  cmcImageUrl: process.env.NEXT_PUBLIC_CMC_IMAGE_URL || 'https://s2.coinmarketcap.com/static/img/coins/64x64',
} as const;

export const getApiUrl = (path: string) => {
  const url = `${config.apiPath}${path}`;
  return url;
};

export const getCmcImageUrl = (cmcId: string | number) => {
  const url = `${config.cmcImageUrl}/${cmcId}.png`;
  return url;
};


export const getPageUrl = (path: string) => {
  return `${config.basePath}${path}`;
};
