import { useState } from "react";
import ReactMarkdown from "react-markdown";
import YouTube from "react-youtube";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

function App() {
    const [unformattedText, setUnformattedText] = useState("");

    const handleTextChange = (e) => {
        setUnformattedText(e.target.value);
    };

    const allowedElements = ["p", "strong", "em", "a"];

    function extractVideoId(url) {
        const regex =
            /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    const customRenderer = {
        p: ({ children }) => <p className="text-center">{children}</p>,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        a: ({ href, children }) => {
            const youtubeRegex =
                /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)/;
            const mapRegex =
                /^%5B[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)%5D$/;

            if (href.match(youtubeRegex)) {
                const videoId = extractVideoId(href);
                return (
                    <div className="flex justify-center">
                        <YouTube
                            videoId={videoId}
                            opts={{
                                width: "400",
                                height: "200",
                                playerVars: { autoplay: 0 },
                            }}
                        />
                    </div>
                );
            }

            if (href.match(mapRegex)) {
                const match = href.match(mapRegex);
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[4]);
                console.log(lat, lng);
                return (
                    <div className="flex justify-center">
                        <MapContainer
                            className="w-[400px] h-[200px] overflow-hidden"
                            center={[lat, lng]}
                            zoom={13}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[lat, lng]}>
                                <Popup>{children}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                );
            }

            return (
                <a href={href} target="_blank" rel="noreferrer noopener">
                    {children}
                </a>
            );
        },
    };

    return (
        <div className="text-center w-1/2">
            <h1 className="text-2xl">Markdown in Ask @lvkaszus!</h1>
            <input
                className="my-4 w-full"
                type="text"
                placeholder="Type here!"
                value={unformattedText}
                onChange={handleTextChange}
            ></input>
            <ReactMarkdown
                allowedElements={allowedElements}
                components={customRenderer}
            >
                {unformattedText}
            </ReactMarkdown>
        </div>
    );
}

export default App;
