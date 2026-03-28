ปรับ swagger-json

{{swagger-json}}

จาก OpenAPI (Swagger) ต้องการสร้าง PostMan test script UserController ชื่อ user-flow-collection.json

1.POST api/auth → login 
2.POST /api/users → create user 
	2.1 ใช้ค่าจาก @ApiProperty จาก CreateUserDto
	2.2 เก็บค่า pm.response.json() ลงใน pm.environment 
3.GET /api/users → get all users จาก create user 
4.GET /api/users/{id} → get user by id
	4.1 ใช้ค่า {id} จาก pm.environment ที่ได้จาก create user
5.PATCH /api/users/{id} → update user 
	5.1 ใช้ค่า {id} จาก pm.environment ที่ได้จาก create user เพื่อ patch UpdateUserDto.email = temp99@gmail.com
6.DELETE /api/users/{id} → delete user
	6.1 ใช้ค่า {id} จาก pm.environment ที่ได้จาก create user เพื่อ delete
7.POST api/auth → out 

และสร้าง user-flow-env.json

{
  "id": "env1",
  "name": "Auth Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "enabled": true
    }
  ],
  "_postman_variable_scope": "environment"
} 


    

    
   
     