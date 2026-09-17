const HEADERS = {
    "Content-Type": "application/json",
    "fiware-service": "smart",
    "fiware-servicepath": "/",
};

export const sendCommand = async (orionUrl, command) => {
    const res = await fetch(
        `${orionUrl}/v2/entities/urn:ngsi-ld:lamp:001/attrs`,
        {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify({
                [command]: { type: "command", value: "" },
            }),
        }
    );
    return res.ok;
}

export const getLampState = async (orionUrl) => {
    const res = await fetch(
        `${orionUrl}/v2/entities/urn:ngsi-ld:Lamp:001`,
        { headers: HEADERS }
    );
    if (!res.ok) throw new Error("Erro ao buscar estado da lamp");
    const data = await res.json();
    return {
        state: data.state?.value || "off",
        luminosity: data.luminosity?.value ?? 0,
    };
};