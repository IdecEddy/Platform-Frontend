const devFlags = {
  rings: true,
  sandbox: true,
}

const prodFlags = {
  rings: false,
  sandbox: false,
}

const config = process.env.NODE_ENV === 'development' ? devFlags : prodFlags

export default config;
