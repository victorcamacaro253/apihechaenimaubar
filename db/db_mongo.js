import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = 'mongodb+srv://user:???@cluster0.dhwmu.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connect() {
  try {
    await client.connect()
    const database = client.db('database')
    return database
  } catch (error) {
    console.error('Error connecting to the database:', error)
    await client.close()
  }
}
