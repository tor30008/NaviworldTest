import type { Request , Response } from 'express';
import * as examTypes from './example.type'
import ExcelJS from "exceljs";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../example.env') });

export const getToken = async() => {
    try{
        const urlAccessToken = process.env.URL_ACCESSTOKEN as string ?? "";
        const body = new URLSearchParams();
        body.append('client_id', process.env.CLIENT_ID ?? "");
        body.append('client_secret', process.env.CLIENT_SECRET ?? "");
        body.append('scope', process.env.SCOPE ?? "");
        body.append('grant_type', process.env.GRANT_TYPE ?? "");

        const accessToken = await fetch(urlAccessToken,{
            method:'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body:body
        })

        const tokenData = await accessToken.json();
        return tokenData.access_token;
    }catch(error){
        console.log(error);
    }
}

export const getItem = async() => {
    try{
        const token = await getToken();
        const items = await fetch(process.env.URL_GETITEM ?? "",{
            method:'GET',
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        })

        const itemsData = await items.json();
        let itemsFilter = itemsData.value.filter(item => item.inventory != 0);

        let categoryGroup = new Map<string,examTypes.CATEGORYDATA>()

        for(const item of itemsFilter){
            if(!categoryGroup.has(item.itemCategoryCode)){
                categoryGroup.set(item.itemCategoryCode,{
                    itemCategoryCode:item.itemCategoryCode,
                    totalqty:0,
                    itemscount:0,
                    products:[]
                }) as examTypes.CATEGORYDATA
            }

            let check = categoryGroup.get(item.itemCategoryCode)
            check!.totalqty += item.inventory;
            check!.itemscount += 1;


            check!.products.push({
               ...item
            });
        }

        const sort : examTypes.CATEGORYDATA[] = Array.from(categoryGroup.values()).sort((a,b) => a.itemCategoryCode.localeCompare(b.itemCategoryCode))

        return sort;

    }catch(error){
        console.log(error);
    }
}

export const listItem = async(req:Request , res:Response) => {
    let responseData:examTypes.RESPONSEDATA = { code : 200 , success : true , message : "success" }
    try{
        const items = await getItem();
        responseData.data = items;
        return res.status(responseData.code).json(responseData);
    }catch(error){
        responseData.code = 500;
        responseData.success = false;
        responseData.message = "error";
        responseData.error = error;
        return res.status(responseData.code).json(responseData);
    }
}

export const getItemReport = async(req:Request , res:Response) => {
    let responseData:examTypes.RESPONSEDATA = { code : 200 , success : true , message : "success" }
    try{
        const items = await getItem();
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Example Report");
        sheet.getRow(1).font = {bold:true}

        sheet.columns = [
             { header:"Category" , key:"category", width:15},
             { header: "displayName", key: "displayName", width: 30 },
             { header: "@odata.etag", key: "@odata.etag", width: 30 },
             { header: "id", key: "id", width: 30 },
             { header: "number", key: "number", width: 30 },
             { header: "displayName2", key: "displayName2", width: 30 },
             { header: "type", key: "type", width: 30 },
             { header: "itemCategoryId", key: "itemCategoryId", width: 30 },
             { header: "itemCategoryCode", key: "itemCategoryCode", width: 30 },
             { header: "blocked", key: "blocked", width: 30 },
             { header: "gtin", key: "gtin", width: 30 },
             { header: "inventory", key: "inventory", width: 30 },
             { header: "unitPrice", key: "unitPrice", width: 30 },
             { header: "priceIncludesTax", key: "priceIncludesTax", width: 30 },
             { header: "unitCost", key: "unitCost", width: 30 },
             { header: "taxGroupId", key: "taxGroupId", width: 30 },
             { header: "taxGroupCode", key: "taxGroupCode", width: 30 },
             { header: "baseUnitOfMeasureId", key: "baseUnitOfMeasureId", width: 30 },
             { header: "baseUnitOfMeasureCode", key: "baseUnitOfMeasureCode", width: 30 },
             { header: "generalProductPostingGroupId", key: "generalProductPostingGroupId", width: 30 },
             { header: "generalProductPostingGroupCode", key: "generalProductPostingGroupCode", width: 30 },
             { header: "inventoryPostingGroupId", key: "inventoryPostingGroupId", width: 30 },
             { header: "inventoryPostingGroupCode", key: "inventoryPostingGroupCode", width: 30 },
             { header: "lastModifiedDateTime", key: "lastModifiedDateTime", width: 30 }
        ]
        sheet.getRow(1).font = { bold:true }

        let row = 2;
        for(const item of items!){
            sheet.getRow(row).getCell(1).value = item.itemCategoryCode
            sheet.getRow(row).font = { bold:true }
            for(const product of item.products){
                row++
                sheet.getRow(row).getCell(2).value = product['displayName'];
                sheet.getRow(row).getCell(3).value = product['@odata.etag'];
                sheet.getRow(row).getCell(4).value = product['id'];
                sheet.getRow(row).getCell(5).value = product['number']
                sheet.getRow(row).getCell(6).value = product['displayName2'];
                sheet.getRow(row).getCell(7).value = product['type'];
                sheet.getRow(row).getCell(8).value = product['itemCategoryId'];
                sheet.getRow(row).getCell(9).value = product['itemCategoryCode'];
                sheet.getRow(row).getCell(10).value = product['blocked'];
                sheet.getRow(row).getCell(11).value = product['gtin'];
                sheet.getRow(row).getCell(12).value = product['inventory'];
                sheet.getRow(row).getCell(13).value = product['unitPrice'];
                sheet.getRow(row).getCell(14).value = product['priceIncludesTax'];
                sheet.getRow(row).getCell(15).value = product['unitCost'];
                sheet.getRow(row).getCell(16).value = product['taxGroupId'];
                sheet.getRow(row).getCell(17).value = product['taxGroupCode'];
                sheet.getRow(row).getCell(18).value = product['baseUnitOfMeasureId'];
                sheet.getRow(row).getCell(19).value = product['baseUnitOfMeasureCode'];
                sheet.getRow(row).getCell(20).value = product['generalProductPostingGroupId'];
                sheet.getRow(row).getCell(21).value = product['generalProductPostingGroupCode'];
                sheet.getRow(row).getCell(22).value = product['inventoryPostingGroupId'];
                sheet.getRow(row).getCell(23).value = product['inventoryPostingGroupCode'];
                sheet.getRow(row).getCell(24).value = product['lastModifiedDateTime'];
            }
            row++;
            sheet.getRow(row).getCell(1).value = "Total Items";
            sheet.getRow(row).getCell(2).value = item.itemscount;
            sheet.getRow(row).getCell(3).value = "Total Category"
            sheet.getRow(row).getCell(4).value = item.totalqty;
            sheet.getRow(row).font = { bold : true }
            row = row + 2;
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");

        await workbook.xlsx.write(res)

        res.end();

    }catch(error){
       responseData.code = 500;
       responseData.success = false;
       responseData.message = "error";
       responseData.error = error; 
       res.status(responseData.code).json(responseData);
    }
}