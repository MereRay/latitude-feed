export default async function handler(req, res) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  const buddy = req.query.buddy;

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?filterByFormula={Buddy}='${buddy}'`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`
    }
  });

  const data = await response.json();

  const posts = data.records.map(record => ({
    caption: record.fields.Caption,
    image: record.fields.Image?.[0]?.url,
    link: record.fields["View on Instagram"]
  }));

  res.status(200).json(posts);
}
