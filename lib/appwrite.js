import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.jsm.aora',
    projectId: '6649649e001088f55022',
    databaseId: '664965a9001f7d7f22ea',
    userCollectionId: '664965d2002ec2595362',
    videoCollectionId: '664965eb002e43c3d717',
    storageId: '664966e900285098a5d1'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;
const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
    try 
        {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username
            )

            if (!newAccount) throw Error

            const avatarUrl = avatars.getInitials(username)

            await signIn(email, password)

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email, 
                    username,
                    avatar: avatarUrl
                }
            )
            return newUser
        }

    catch (error) 
        {
            console.log(error)
            throw new Error(error)
        } 
}

export async function signIn(email, password) {
    try {
            const session = await account.createEmailPasswordSession(email, password)
            return session
    }
    catch (error){
        throw new Error(error)
    }
}

