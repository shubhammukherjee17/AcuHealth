import vision from "@google-cloud/vision";

const CONFIG = {
  credentials: {
    client_email: process.env.VISION_CLIENT_EMAIL,
    private_key: process.env.VISION_PRIVATE_KEY,
  },
};

const client = new vision.ImageAnnotatorClient(CONFIG);

export async function getImageLabels(filePath: string) {
  const [result] = await client.labelDetection(filePath);
  const labels = result.labelAnnotations;
  console.log("Labels:");
  return labels?.forEach((label) => console.log(label.description));
}
