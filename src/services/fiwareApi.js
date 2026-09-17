const BASE_HEADERS = {
  "fiware-service": "smart",
  "fiware-servicepath": "/",
};

export const sendCommand = async (command) => {
  const res = await fetch("/v2/entities/urn:ngsi-ld:Lamp:001/attrs", {
    method: "PATCH",
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      [command]: { type: "command", value: "" },
    }),
  });
  return res.ok;
};

export const getLampState = async () => {
  const res = await fetch("/v2/entities/urn:ngsi-ld:Lamp:001", {
    headers: BASE_HEADERS,
  });
  if (!res.ok) throw new Error("Erro ao buscar estado");
  const data = await res.json();
  return {
    state: data.state?.value || "off",
    luminosity: data.luminosity?.value ?? 0,
  };
};