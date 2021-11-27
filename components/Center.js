import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "./Songs"
import moment from "moment"

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
]

const Center = () => {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);

    useEffect(() => setColor(shuffle(colors).pop()), [playlistId])

    useEffect(() => {
        spotifyApi
            .getPlaylist(playlistId)
            .then((data) => setPlaylist(data.body))
            .catch((err) => console.log("Error:", err))
    }, [spotifyApi, playlistId])

    console.log(playlist)

    const duration = moment.duration(playlist?.tracks.items.reduce((acc, track) => acc + track.track.duration_ms, 0), "milliseconds");
    const time = `${duration.hours()} hr ${duration.minutes()} min`

    return (
        <div className="flex-grow h-screen overflow-y-auto scrollbar-hide">
            {/* Header */}
            <header onClick={() => signOut()} className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
                    <img
                        className="rounded-full w-10 h-10"
                        src={session?.user.image}
                        alt={session?.user.name}
                    />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            {/* Playlist Info */}
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img
                    className="h-44 w-44 shadow-2xl"
                    src={playlist?.images?.[0]?.url}
                    alt={playlist?.name}
                />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                    <p className="text-gray-500 text-sm pt-2.5">
                        <span className="font-bold text-white">{playlist?.owner.display_name} </span>
                        •{" "}
                        {playlist?.tracks.total > 100 ? 100 : playlist?.tracks.total} songs,{" "}
                        {time}
                    </p>
                </div>
            </section>

            {/* Songs */}
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center