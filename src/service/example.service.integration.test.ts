import { jest } from '@jest/globals';
import { getToken, getItem , getItemReport } from './example.service';
import express from 'express';
import request from "supertest";
import 'dotenv/config'; 

describe('Integration Test for Business Central API', () => {

    jest.setTimeout(30000);
    describe('getToken()', () => {
        it('should be get token as string', async () => {
            const token = await getToken();
            expect(token).toBeDefined();           
            expect(typeof token).toBe('string');   
            expect(token.length).toBeGreaterThan(0);
        });
    });

    describe('getItem()', () => {
        it('Should be get item success', async () => {

            const groupedItems = await getItem();
            expect(groupedItems).toBeDefined();
            expect(Array.isArray(groupedItems)).toBe(true);

            if (groupedItems && groupedItems.length > 0) {
                const firstCategory = groupedItems[0];
                
                expect(firstCategory.products).toBeDefined();
                expect(Array.isArray(firstCategory.products)).toBe(true);

                if (firstCategory.products.length > 0) {
                    const firstProduct = firstCategory.products[0];

                    console.log('Sample product received:', firstProduct);

                    expect(firstProduct).toHaveProperty('number');
                    expect(firstProduct).toHaveProperty('displayName');
                    expect(firstProduct).toHaveProperty('itemCategoryCode');
                    expect(firstProduct).toHaveProperty('inventory');
                    expect(typeof firstProduct.inventory).toBe('number');
                }
            }
        });
    });
});

const app = express();
app.get("/reportItems", getItemReport);
describe("GET /reportItems (Integration)", () => {
  it("Should be get file download", async () => {
    console.log(app);
    const res = await request(app)
                    .get("/reportItems")
                    .buffer(true)
                    .parse((res, callback) => {
                        const data: Buffer[] = [];
                        res.on("data", (chunk) => data.push(chunk));
                        res.on("end", () => callback(null, Buffer.concat(data)));
                    });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    expect(res.headers["content-disposition"]).toContain("example.xlsx");
    expect(res.body).toBeDefined();

    expect(res.body.length).toBeGreaterThan(1);
  }, 30000); 
});

