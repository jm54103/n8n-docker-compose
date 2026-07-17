import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { N8nErrorItemDto } from './dto/n8n-error-payload.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('n8n')
export class N8nController {
  
  @Post('error')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'รับแจ้งเตือน Error จาก n8n' })
  @ApiBody({ type: [N8nErrorItemDto] }) // บน Swagger โชว์เป็น Array เหมือนเดิม
  postHandleN8nError(@Body() payload: any[]) { // 👈 เปลี่ยน Type ตรงนี้เป็น any[] เพื่อข้ามขั้นตอน Whitelist Check ระดับ Top-level Array
    
    // ดึงข้อมูลมาใช้งานตามโครงสร้าง Array
    const firstError = payload[0];
    if (!firstError) return { status: 'no_data' };

    // แตกข้อมูลใช้งานตามปกติ
    const executionId = firstError.execution?.id;
    const workflowName = firstError.workflow?.name || 'Unknown Workflow';
    const workflowId = firstError.workflow?.id;
    const errorMessage = firstError.execution?.error?.message || 'No error message provided';
    const lastNode = firstError.execution?.lastNodeExecuted;
    const executionUrl = firstError.execution?.url;

    console.log(`[Workflow Failed] Name: "${workflowName}" (ID: ${workflowId})`);
    console.log(`[Execution ID]: ${executionId}`);
    console.log(`[Error Message]: ${errorMessage}`);
    console.log(`[Last Node]: ${lastNode}`);
    console.log(`[Execution URL]: ${executionUrl}`);

    return {
      status: 'success',
      received: true,
      message: `Error logged successfully.`,
    };
  }
}