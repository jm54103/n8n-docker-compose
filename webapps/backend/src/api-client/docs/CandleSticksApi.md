# CandleSticksApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**candleSticksControllerCreate**](#candlestickscontrollercreate) | **POST** /candle-sticks | บันทึกข้อมูลแท่งเทียนใหม่|
|[**candleSticksControllerFindAll**](#candlestickscontrollerfindall) | **GET** /candle-sticks/{symbol} | ดึงข้อมูลแท่งเทียนทั้งหมดตาม Symbol|
|[**candleSticksControllerFindByRange**](#candlestickscontrollerfindbyrange) | **GET** /candle-sticks/{symbol}/range | ดึงข้อมูลแท่งเทียนตามช่วงวันที่|

# **candleSticksControllerCreate**
> candleSticksControllerCreate()


### Example

```typescript
import {
    CandleSticksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CandleSticksApi(configuration);

const { status, data } = await apiInstance.candleSticksControllerCreate();
```

### Parameters
This endpoint does not have any parameters.


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
|**201** | บันทึกสำเร็จ |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **candleSticksControllerFindAll**
> Array<CandleStick> candleSticksControllerFindAll()


### Example

```typescript
import {
    CandleSticksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CandleSticksApi(configuration);

let symbol: string; // (default to undefined)

const { status, data } = await apiInstance.candleSticksControllerFindAll(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] |  | defaults to undefined|


### Return type

**Array<CandleStick>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | คืนค่ารายการแท่งเทียน |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **candleSticksControllerFindByRange**
> Array<CandleStick> candleSticksControllerFindByRange()


### Example

```typescript
import {
    CandleSticksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CandleSticksApi(configuration);

let symbol: string; // (default to undefined)
let start: string; // (default to undefined)
let end: string; // (default to undefined)

const { status, data } = await apiInstance.candleSticksControllerFindByRange(
    symbol,
    start,
    end
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] |  | defaults to undefined|
| **start** | [**string**] |  | defaults to undefined|
| **end** | [**string**] |  | defaults to undefined|


### Return type

**Array<CandleStick>**

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

