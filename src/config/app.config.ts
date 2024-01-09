declare interface AppConfigOptions {
  port: number
  host: string
}

export const appConfig: AppConfigOptions = {
  host: process.env.APP_HOST,
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000
}