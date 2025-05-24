targetScope = 'resourceGroup'

param sqlServerName string = 'abdsqlserver'
param location string = resourceGroup().location
param sqlDatabaseName string = 'abdsqldb'
param azureAdAdminObjectId string = 'e4659c2d-43d6-4d7d-82b0-c014d86eb565'
param clientIpAddress string = '192.168.100.126'

@secure()
param dummySqlPassword string = '' // Removed default value for security

resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: 'entraadmin'
    administratorLoginPassword: dummySqlPassword
    publicNetworkAccess: 'Enabled'
    minimalTlsVersion: '1.2'
    administrators: {
      azureADOnlyAuthentication: true
      administratorType: 'ActiveDirectory'
      login: 'mabdullah@puffersoft.com'
      sid: azureAdAdminObjectId
      tenantId: subscription().tenantId
    }
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location // Explicitly added location
  sku: {
    name: 'GP_S_Gen5_1'
    tier: 'GeneralPurpose'
  }
  properties: {
    autoPauseDelay: 60
  }
}

resource clientIpFirewallRule 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'ClientIPRule'
  properties: {
    startIpAddress: clientIpAddress
    endIpAddress: clientIpAddress
  }
}

resource allowAzureServices 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}
