# UserGroupsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userGroupsControllerCreate**](#usergroupscontrollercreate) | **POST** /user-groups | |
|[**userGroupsControllerFindAll**](#usergroupscontrollerfindall) | **GET** /user-groups | |
|[**userGroupsControllerFindOne**](#usergroupscontrollerfindone) | **GET** /user-groups/{id} | |
|[**userGroupsControllerRemove**](#usergroupscontrollerremove) | **DELETE** /user-groups/{id} | |
|[**userGroupsControllerUpdate**](#usergroupscontrollerupdate) | **PATCH** /user-groups/{id} | |

# **userGroupsControllerCreate**
> UserGroup userGroupsControllerCreate(createUserGroupDto)


### Example

```typescript
import {
    UserGroupsApi,
    Configuration,
    CreateUserGroupDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserGroupsApi(configuration);

let createUserGroupDto: CreateUserGroupDto; //

const { status, data } = await apiInstance.userGroupsControllerCreate(
    createUserGroupDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserGroupDto** | **CreateUserGroupDto**|  | |


### Return type

**UserGroup**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userGroupsControllerFindAll**
> Array<UserGroup> userGroupsControllerFindAll()


### Example

```typescript
import {
    UserGroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserGroupsApi(configuration);

const { status, data } = await apiInstance.userGroupsControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserGroup>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userGroupsControllerFindOne**
> UserGroup userGroupsControllerFindOne()


### Example

```typescript
import {
    UserGroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserGroupsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.userGroupsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UserGroup**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userGroupsControllerRemove**
> UserGroup userGroupsControllerRemove()


### Example

```typescript
import {
    UserGroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserGroupsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.userGroupsControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UserGroup**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userGroupsControllerUpdate**
> UserGroup userGroupsControllerUpdate(body)


### Example

```typescript
import {
    UserGroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserGroupsApi(configuration);

let id: number; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.userGroupsControllerUpdate(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UserGroup**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

