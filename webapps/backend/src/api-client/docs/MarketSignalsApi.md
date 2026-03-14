# MarketSignalsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**marketSignalsControllerGetAll**](#marketsignalscontrollergetall) | **GET** /MarketSignals | |
|[**marketSignalsControllerGetBullish**](#marketsignalscontrollergetbullish) | **GET** /MarketSignals/bullish | |
|[**marketSignalsControllerGetOne**](#marketsignalscontrollergetone) | **GET** /MarketSignals/{symbol} | |

# **marketSignalsControllerGetAll**
> Array<MarketSignal> marketSignalsControllerGetAll()


### Example

```typescript
import {
    MarketSignalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketSignalsApi(configuration);

const { status, data } = await apiInstance.marketSignalsControllerGetAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<MarketSignal>**

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

# **marketSignalsControllerGetBullish**
> Array<MarketSignal> marketSignalsControllerGetBullish()


### Example

```typescript
import {
    MarketSignalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketSignalsApi(configuration);

const { status, data } = await apiInstance.marketSignalsControllerGetBullish();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<MarketSignal>**

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

# **marketSignalsControllerGetOne**
> MarketSignal marketSignalsControllerGetOne()


### Example

```typescript
import {
    MarketSignalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketSignalsApi(configuration);

let symbol: string; // (default to undefined)

const { status, data } = await apiInstance.marketSignalsControllerGetOne(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] |  | defaults to undefined|


### Return type

**MarketSignal**

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

