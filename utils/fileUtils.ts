import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export async function readData(fileName: string) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName} data:`, error);
    return [];
  }
}

export async function writeData(fileName: string, data: never) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing ${fileName} data:`, error);
  }
}
