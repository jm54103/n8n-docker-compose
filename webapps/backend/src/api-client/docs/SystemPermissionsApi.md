# SystemPermissionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**systemPermissionsControllerCreate**](#systempermissionscontrollercreate) | **POST** /system-permissions | |
|[**systemPermissionsControllerFindAll**](#systempermissionscontrollerfindall) | **GET** /system-permissions | |
|[**systemPermissionsControllerFindOne**](#systempermissionscontrollerfindone) | **GET** /system-permissions/{id} | |
|[**systemPermissionsControllerRemove**](#systempermissionscontrollerremove) | **DELETE** /system-permissions/{id} | |
|[**systemPermissionsControllerUpdate**](#systempermissionscontrollerupdate) | **PATCH** /system-permissions/{id} | |

# **systemPermissionsControllerCreate**
> SystemPermission systemPermissionsControllerCreate(createSystemPermissionDto)


### Example

```typescript
import {
    SystemPermissionsApi,
    Configuration,
    CreateSystemPermissionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPermissionsApi(configuration);

let createSystemPermissionDto: CreateSystemPermissionDto; //

const { status, data } = await apiInstance.systemPermissionsControllerCreate(
    createSystemPermissionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSystemPermissionDto** | **CreateSystemPermissionDto**|  | |


### Return type

**SystemPermission**

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

# **systemPermissionsControllerFindAll**
> Array<SystemPermission> systemPermissionsControllerFindAll()


### Example

```typescript
import {
    SystemPermissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPermissionsApi(configuration);

const { status, data } = await apiInstance.systemPermissionsControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SystemPermission>**

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

# **systemPermissionsControllerFindOne**
> SystemPermission systemPermissionsControllerFindOne()


### Example

```typescript
import {
    SystemPermissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPermissionsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.systemPermissionsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SystemPermission**

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

# **systemPermissionsControllerRemove**
> SystemPermission systemPermissionsControllerRemove()


### Example

```typescript
import {
    SystemPermissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPermissionsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.systemPermissionsControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SystemPermission**

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

# **systemPermissionsControllerUpdate**
> SystemPermission systemPermissionsControllerUpdate(body)


### Example

```typescript
import {
    SystemPermissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPermissionsApi(configuration);

let id: number; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.systemPermissionsControllerUpdate(
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

**SystemPermission**

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

