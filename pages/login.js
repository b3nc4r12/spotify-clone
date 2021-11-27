import Head from "next/head"
import { getProviders, signIn } from "next-auth/react"

const Login = ({ providers }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full">
            <Head>
                <title>Login with Spotify</title>
            </Head>

            <img
                className="w-52 mb-5"
                src="https://links.papareact.com/9xl"
                alt="Spotify"
            />
            {Object.values(providers).map((provider, index) => (
                <div key={index}>
                    <button
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                        className="bg-[#18D860] text-white p-5 rounded-full"
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers
        }
    }
}