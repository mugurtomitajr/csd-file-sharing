const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    channels: {
        APP_INFO: 'app_info',
    },
    isProduction: isProduction,
};