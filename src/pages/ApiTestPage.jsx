import React, { useState, useEffect } from 'react'
import api, { health, menu, admin } from '../services/api'

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const results = {}

    // Test health check
    try {
      const healthResponse = await health.check()
      results.health = { status: 'success', data: healthResponse.data }
    } catch (error) {
      results.health = { status: 'error', error: error.message }
    }

    // Test menu categories
    try {
      const categoriesResponse = await menu.getCategories()
      results.categories = { status: 'success', data: categoriesResponse.data }
    } catch (error) {
      results.categories = { status: 'error', error: error.message }
    }

    // Test menu items
    try {
      const itemsResponse = await menu.getMenuItems()
      results.menuItems = { status: 'success', data: itemsResponse.data }
    } catch (error) {
      results.menuItems = { status: 'error', error: error.message }
    }

    // Test dashboard stats
    try {
      const statsResponse = await admin.getDashboardStats()
      results.dashboardStats = { status: 'success', data: statsResponse.data }
    } catch (error) {
      results.dashboardStats = { status: 'error', error: error.message }
    }

    setTestResults(results)
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const renderTestResult = (testName, result) => (
    <div key={testName} className="mb-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{testName}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          result.status === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {result.status}
        </span>
      </div>

      {result.status === 'success' ? (
        <div className="bg-green-50 p-3 rounded">
          <pre className="text-sm overflow-auto max-h-40">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-red-50 p-3 rounded">
          <p className="text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Backend API Tests</h1>
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-blue-900 mb-2">API Configuration</h2>
        <p className="text-blue-700">Base URL: {api.defaults.baseURL}</p>
        <p className="text-blue-700">
          Server Status: {Object.keys(testResults).length > 0 ? 'Connected' : 'Testing...'}
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Running API tests...</p>
        </div>
      )}

      <div className="grid gap-4">
        {Object.entries(testResults).map(([testName, result]) =>
          renderTestResult(testName, result)
        )}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Test Summary</h3>
          <div className="flex gap-4">
            <span className="text-green-600">
              ✓ Passed: {Object.values(testResults).filter(r => r.status === 'success').length}
            </span>
            <span className="text-red-600">
              ✗ Failed: {Object.values(testResults).filter(r => r.status === 'error').length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiTestPage
