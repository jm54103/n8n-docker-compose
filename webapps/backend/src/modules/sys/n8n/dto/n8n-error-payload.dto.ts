// n8n-error-payload.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class WorkflowInfo {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Example Workflow' })
  name: string;
}

class ErrorDetail {
  @ApiProperty({ example: 'Example Error Message' })
  message: string;

  @ApiProperty({ example: 'Stacktrace' })
  stack: string;
}

class ExecutionInfo {
  @ApiProperty({ example: 231 })
  id: number;

  @ApiProperty({ example: 'http://0.0.0.0:5678/execution/workflow/1/231' })
  url: string;

  @ApiProperty({ example: '34', required: false })
  retryOf?: string;

  @ApiProperty({ type: ErrorDetail })
  error: ErrorDetail;

  @ApiProperty({ example: 'Node With Error' })
  lastNodeExecuted: string;

  @ApiProperty({ example: 'manual' })
  mode: string;
}

export class N8nErrorItemDto {
  @ApiProperty({ type: ExecutionInfo })
  @ValidateNested()
  @Type(() => ExecutionInfo)
  execution: ExecutionInfo;

  @ApiProperty({ type: WorkflowInfo })
  @ValidateNested()
  @Type(() => WorkflowInfo)
  workflow: WorkflowInfo;
}

// 🚀 เพิ่ม Class นี้ขึ้นมาเพื่อครอบ Array สำหรับ ValidationPipe
export class N8nErrorPayloadDto {
  @ApiProperty({ type: [N8nErrorItemDto], description: 'รายการ Error จาก n8n' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => N8nErrorItemDto)
  items: N8nErrorItemDto[];
}