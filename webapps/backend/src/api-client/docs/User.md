# User


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** |  | [default to undefined]
**username** | **string** |  | [default to undefined]
**email** | **string** |  | [default to undefined]
**passwordHash** | **string** |  | [default to undefined]
**group** | [**UserGroup**](UserGroup.md) |  | [default to undefined]
**groupId** | **number** |  | [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**isLoggedIn** | **boolean** |  | [default to undefined]
**sessionKey** | **string** |  | [default to undefined]
**loginAttempts** | **number** |  | [default to undefined]
**lockUntil** | **string** |  | [default to undefined]
**lastLogin** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**createdBy** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**updatedBy** | **string** |  | [default to undefined]

## Example

```typescript
import { User } from './api';

const instance: User = {
    userId,
    username,
    email,
    passwordHash,
    group,
    groupId,
    isActive,
    status,
    isLoggedIn,
    sessionKey,
    loginAttempts,
    lockUntil,
    lastLogin,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
