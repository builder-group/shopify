# `@dyn/api-energy-label`

This package provides a wrapper around the European Product Registry for Energy Labelling (EPREL) API. It addresses two key issues for frontends wanting to interact with the EPREL API:

1. **Cross-Origin Restrictions:** The EPREL API does not permit cross-origin requests, preventing direct client-side access from web applications.
2. **API Key Security:** Some EPREL endpoints require an API key, which should be kept secure and not exposed in frontend code.