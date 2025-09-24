# NaviworldTest

# 🚀 ขั้นตอนแรก Install dependencies
- เปิด Terminal 
- พิมพ์ "npm install"
- ** ถ้าขึ้น Error ให้พิมพ์ "sudo npm install"
```bash
npm install
```
<img width="2108" height="342" alt="image" src="https://github.com/user-attachments/assets/831c1863-5dcd-4ef8-af70-88890ff31ec4" />



# ขั้นตอนสอง Start development server 
- เปิด Terminal 
- พิมพ์ "npm run dev"
- Server จะรันอยู่บน Port 1000
```bash
npm run dev
> testnodejs@1.0.0 dev
> tsx watch src/app.ts

[dotenv@17.2.2] injecting env (6) from example.env -- tip: ⚙️  write to custom object with { processEnv: myObject }
Server run 1000
```
<img width="1826" height="216" alt="image" src="https://github.com/user-attachments/assets/d75524f4-9c3d-42cd-9a61-ae8ff51c104b" />

# ขั้นตอนสาม Start Integration test
- เปิด Terminal 
- พิมพ์ "npm run test:integration"
```bash
npm run test:integration
```
<img width="1834" height="448" alt="image" src="https://github.com/user-attachments/assets/5cf268c5-09b1-4073-ada8-a93be2ca0069" />


# API ทดสอบ 
### Get /listItems 
- Filter inventory == 0
- Sort itemCategoryCode alphabetically
- Test on postman http://127.0.0.1:1000/listItems
```bash
http://127.0.0.1:1000/listItems
```
<img width="790" height="439" alt="image" src="https://github.com/user-attachments/assets/e12fc25d-a0a7-456f-97e9-4eeebfec6084" />

### Get /reportItems
- Export Excel
- Excel name "example.xlsx"
```bash
http://127.0.0.1:1000/reportItems
```
# Postman
- แนบไฟล์ทดสอบของ Postman
- File name "NaviWorld.postman_collection.json"
```bash
NaviWorld.postman_collection.json
```
