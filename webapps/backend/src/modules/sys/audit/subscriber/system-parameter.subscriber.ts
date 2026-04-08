import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { SystemParameter } from "../../system-parameters/entities/system-parameter.entity";
import { AuditLog } from "../entities/audit-log.entity";
import { userContext } from "../../../../common/context/context.storage";

@EventSubscriber()
export class SystemParameterSubscriber implements EntitySubscriberInterface<SystemParameter> {
  
  listenTo() {
    return SystemParameter;
  }

  async afterUpdate(event: UpdateEvent<SystemParameter>) {
    const { entity, databaseEntity, manager } = event;
    
    // ดึงเฉพาะ Field ที่มีการเปลี่ยนแปลงจริง ๆ
    const updatedColumns = event.updatedColumns.map(col => col.propertyName);
    
    if (updatedColumns.length > 0) {
      const oldValues: any = {};
      const newValues: any = {};

      updatedColumns.forEach(key => {
        oldValues[key] = (databaseEntity as any)[key];
        newValues[key] = (entity as any)[key];
      });

      // ดึง User จาก Context (ที่ถูกเซ็ตไว้ใน Middleware)
      const context = userContext.getStore();

      const log = manager.create(AuditLog, {
        entityName: 'SystemParameter',
        entityId: entity.paramId || databaseEntity.paramId,
        action: 'UPDATE',
        oldData: oldValues,
        newData: newValues,
        changedBy: context?.userId || 'SYSTEM',
      });

      await manager.save(log);
    }
  }
}