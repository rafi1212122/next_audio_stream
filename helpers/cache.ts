import { createClient } from 'redis'

const cache = async (action: 'get'|'set', key: string, value?: object) => {
    const client = createClient({
        socket: {
            host: '127.0.0.1',
            port: 6379
        }
    })
    await client.connect()

    switch(action){
        case'get':
            const data = await client.get(key).finally(()=>client.disconnect())
            return JSON.parse(data)
        case'set':
            if(!value) throw Error('value is required!')
            return await client.set(key, JSON.stringify(value)).finally(()=>client.disconnect())
            
    }
}

export default cache