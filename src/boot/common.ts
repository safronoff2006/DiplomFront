console.log('Загружен common.ts')
console.log('NODE_ENV', process.env.NODE_ENV)

enum RootApi {
  DEV = 'http://localhost:9000/',
  PROD = '/',
}

let rootApi = RootApi.PROD

if (process.env.DEV) rootApi = RootApi.DEV
else rootApi = RootApi.PROD

const execmode = process.env.NODE_ENV

export default {
  rootApi,
  execmode,
}
