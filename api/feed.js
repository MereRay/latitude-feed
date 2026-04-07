export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  const buddy = req.query.buddy;

  if (!buddy) {
    return res.status(400).json({ error: "Missing buddy parameter" });
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
    TABLE_NAME
  )}?filterByFormula=${encodeURIComponent(`{Buddy}='${buddy}'`)}&sort[0][field]=Date&sort[0][direction]=desc`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    const data = await response.json();

    const posts = (data.records || []).map((record) => ({
      caption: record.fields.Caption || "",
      image: record.fields.Image?.[0]?.url || "",
      link: record.fields["View on Instagram"] || "",
      username: record.fields.Username || "latitudebuddies",
      date: record.fields.Date || "",
    }));

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load feed" });
  }
}
