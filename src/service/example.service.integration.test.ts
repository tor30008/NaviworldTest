import { jest } from '@jest/globals';
import { getToken, getItem , getItemReport ,listItem } from './example.service';
import express from 'express';
import request from "supertest";


const app = express();
app.get("/listItems", listItem);
app.get("/reportItems", getItemReport);

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
                expect(firstCategory).toHaveProperty('itemCategoryCode');
                expect(firstCategory).toHaveProperty('totalqty');
                expect(firstCategory).toHaveProperty('itemscount');

                if (firstCategory.products.length > 0) {
                    const firstProduct = firstCategory.products[0];
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

describe("GET /listItems", () => {
    it("Should return items in JSON format", async () => {
      const res = await request(app).get("/listItems");
  
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("application/json");
      expect(res.body).toHaveProperty("code", 200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "success");
      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    }, 3000);
});

describe("GET /reportItems", () => {
  it("Should be get file download", async () => {
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
    expect(res.body.length).toBeGreaterThan(100);
  }, 5000); 
});

