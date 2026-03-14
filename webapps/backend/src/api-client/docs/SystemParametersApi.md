# SystemParametersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**systemParametersControllerCreate**](#systemparameterscontrollercreate) | **POST** /system-parameters | |
|[**systemParametersControllerFindAll**](#systemparameterscontrollerfindall) | **GET** /system-parameters | |
|[**systemParametersControllerGetValue**](#systemparameterscontrollergetvalue) | **GET** /system-parameters/{key}/value | |
|[**systemParametersControllerUpdate**](#systemparameterscontrollerupdate) | **PATCH** /system-parameters/{id} | |

# **systemParametersControllerCreate**
> SystemParameter systemParametersControllerCreate(createSystemParameterDto)


### Example

```typescript
import {
    SystemParametersApi,
    Configuration,
    CreateSystemParameterDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemParametersApi(configuration);

let createSystemParameterDto: CreateSystemParameterDto; //

const { status, data } = await apiInstance.systemParametersControllerCreate(
    createSystemParameterDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSystemParameterDto** | **CreateSystemParameterDto**|  | |


### Return type

**SystemParameter**

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

# **systemParametersControllerFindAll**
> Array<SystemParameter> systemParametersControllerFindAll()


### Example

```typescript
import {
    SystemParametersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemParametersApi(configuration);

const { status, data } = await apiInstance.systemParametersControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SystemParameter>**

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

# **systemParametersControllerGetValue**
> systemParametersControllerGetValue()


### Example

```typescript
import {
    SystemParametersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemParametersApi(configuration);

let key: string; // (default to undefined)

const { status, data } = await apiInstance.systemParametersControllerGetValue(
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemParametersControllerUpdate**
> SystemParameter systemParametersControllerUpdate(body)


### Example

```typescript
import {
    SystemParametersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemParametersApi(configuration);

let id: number; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.systemParametersControllerUpdate(
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

**SystemParameter**

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

