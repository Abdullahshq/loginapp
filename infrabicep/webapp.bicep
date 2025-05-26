targetScope = 'resourceGroup'

param webAppName string = 'abdregapp'
param linuxFxVersion string = 'node|20-lts'
param location string = resourceGroup().location
param appServicePlanName string = 'abdregapp-plan'

// App Service Plan - Premium V3 P0v3
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'P0v3'
    tier: 'PremiumV3'
    size: 'P0v3'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Web App with system-assigned managed identity
resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: 'abdregapp'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
    httpsOnly: true
  }
}
