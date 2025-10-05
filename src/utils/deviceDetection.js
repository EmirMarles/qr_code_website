// Device detection utility for app store redirects

export const detectDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/android/.test(userAgent)) {
    return 'android';
  } else {
    return 'desktop';
  }
};

export const getAppStoreLinks = () => {
  const device = detectDevice();
  
  const links = {
    ios: 'https://apps.apple.com/app/your-app-id',
    android: 'https://play.google.com/store/apps/details?id=your.package.name',
    desktop: {
      ios: 'https://apps.apple.com/app/your-app-id',
      android: 'https://play.google.com/store/apps/details?id=your.package.name'
    }
  };
  
  return { device, links };
};

export const redirectToAppStore = (platform) => {
  const { links } = getAppStoreLinks();
  
  if (platform === 'ios') {
    window.open(links.ios, '_blank');
  } else if (platform === 'android') {
    window.open(links.android, '_blank');
  }
};
