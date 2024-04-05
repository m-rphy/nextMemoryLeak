
/**
 * This service is here in an attempt to reporduce a bug in a production next JS application
 * 
 * The nature of the bug looks like a memory leak except the leak doesn't occur unitl a route is 
 * hit. So this service will represent the manyRequests that are sent by our sync function 
 */

function dynamicUrlGenerator(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let result = ''

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
}

async function sendRequest() {
    try {
        const randomString = dynamicUrlGenerator(1000)
        const url = 'http://localhost:3001/'+randomString
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            return 
        } else {
            console.log('response not ok', response)
        }
    } catch (error) {
        console.error('sendRequest error:', error)
    }
}

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

let toSendManyRequest = true
export async function start() {
    while (toSendManyRequest) {
        await sendRequest()
        await delay(5)
    }
}