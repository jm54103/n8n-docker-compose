# UserGroup


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**groupId** | **number** |  | [default to undefined]
**groupName** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**users** | [**Array&lt;User&gt;**](User.md) |  | [default to undefined]
**permissions** | [**Array&lt;SystemPermission&gt;**](SystemPermission.md) |  | [default to undefined]

## Example

```typescript
import { UserGroup } from './api';

const instance: UserGroup = {
    groupId,
    groupName,
    description,
    createdAt,
    users,
    permissions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
