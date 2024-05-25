import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
    },
  }
}
