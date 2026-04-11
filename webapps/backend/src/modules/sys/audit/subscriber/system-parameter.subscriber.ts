import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { SystemParameter } from "../../system-parameters/entities/system-parameter.entity";
import { AuditLog } from "../entities/audit-log.entity";
import { userContext } from "../../../../common/context/context.storage";

@EventSubscriber()
export class SystemParameterSubscriber implements EntitySubscriberInterface<SystemParameter> {
  
  listenTo() {
    return SystemParameter;
  }

  /**
   * บันทึก Log เมื่อมีการเพิ่มข้อมูลใหม่
   */  

  // --- ส่วนของ afterInsert ---
  async afterInsert(event: InsertEvent<SystemParameter>) {
    const { entity, manager } = event;
    const context = userContext.getStore();

    try {
      const log = manager.create(AuditLog, {
        entityName: 'SystemParameter',
        // แก้จาก String() เป็น Number() หรือใช้ + นำหน้าเพื่อแปลงเป็น number
        entityId: Number(entity.paramId), 
        action: 'INSERT',
        oldData: null,
        newData: entity,
        changedBy: context?.userId || 'SYSTEM',
      });

      await manager.save(log);
    } catch (error) {
      console.error('AuditLog Insert Error:', error);
    }
  }

  /**
   * บันทึก Log เมื่อมีการแก้ไขข้อมูล
   */
  async afterUpdate(event: UpdateEvent<SystemParameter>) {
    const { entity, databaseEntity, manager, updatedColumns } = event;

    if (!updatedColumns || updatedColumns.length === 0) return;

    const oldValues: Record<string, any> = {};
    const newValues: Record<string, any> = {};
    let hasChanges = false;

    updatedColumns.forEach(column => {
      const propertyName = column.propertyName;
      const oldValue = (databaseEntity as any)[propertyName];
      const newValue = (entity as any)[propertyName];

      // บันทึกเฉพาะที่มีการเปลี่ยนแปลงจริง
      if (newValue !== undefined && oldValue !== newValue) {
        oldValues[propertyName] = oldValue;
        newValues[propertyName] = newValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      const context = userContext.getStore();
      try {
        const log = manager.create(AuditLog, {
          entityName: 'SystemParameter',
          // แก้ให้เป็น number เช่นกัน
          entityId: Number(databaseEntity?.paramId || (entity as any)?.paramId),
          action: 'UPDATE',
          oldData: oldValues,
          newData: newValues,
          changedBy: context?.userId || 'SYSTEM',
        });

        await manager.save(log);
      } catch (error) {
        console.error('AuditLog Update Error:', error);
      }
    }
  }
}