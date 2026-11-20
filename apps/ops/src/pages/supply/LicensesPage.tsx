import React, { useState } from 'react';
import { licenses } from '../../data/seedData';
import { DocumentCheckIcon, MagnifyingGlassIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format, parseISO, isAfter, addDays } from 'date-fns';

export function LicensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    const matchesType = typeFilter === 'all' || license.type.includes(typeFilter);
    
    if (expiryFilter !== 'all') {
      const expiryDate = parseISO(license.expiryDate);
      const now = new Date();
      if (expiryFilter === 'expired' && !isAfter(expiryDate, now)) return matchesSearch && matchesStatus && matchesType;
      if (expiryFilter === 'expiring-soon' && isAfter(expiryDate, now) && !isAfter(expiryDate, addDays(now, 30))) return matchesSearch && matchesStatus && matchesType;
      if (expiryFilter === 'valid' && isAfter(expiryDate, addDays(now, 30))) return matchesSearch && matchesStatus && matchesType;
      return false;
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon className="h-4 w-4 text-emerald-400" />;
      case 'Needs review':
        return <ClockIcon className="h-4 w-4 text-yellow-400" />;
      case 'Expired':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />;
      default:
        return <DocumentCheckIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusChip = (status: string) => {
    const colors: Record<string, string> = {
      'Approved': 'bg-emerald-900 text-emerald-300 border-emerald-600',
      'Needs review': 'bg-yellow-900 text-yellow-300 border-yellow-600',
      'Expired': 'bg-red-900 text-red-300 border-red-600',
      'Uploaded': 'bg-blue-900 text-blue-300 border-blue-600'
    };
    return colors[status] || colors['Uploaded'];
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = parseISO(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = addDays(now, 30);

    if (isAfter(now, expiry)) {
      return { status: 'expired', color: 'text-red-400', text: 'Expired' };
    } else if (isAfter(thirtyDaysFromNow, expiry)) {
      return { status: 'expiring', color: 'text-yellow-400', text: 'Expiring Soon' };
    } else {
      return { status: 'valid', color: 'text-emerald-400', text: 'Valid' };
    }
  };

  const licenseTypes = [...new Set(licenses.map(l => l.type.split(' ')[0]))];
  const statuses = ['Uploaded', 'Needs review', 'Approved', 'Expired'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Licenses & Compliance</h1>
          <p className="text-gray-400">Manage all compliance documents across properties and vendors</p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          <DocumentCheckIcon className="h-4 w-4" />
          <span>Upload License</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-8 w-8 text-emerald-400" />
            <div>
              <p className="text-emerald-300 text-2xl font-bold">
                {licenses.filter(l => l.status === 'Approved').length}
              </p>
              <p className="text-emerald-200 text-sm">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-yellow-300 text-2xl font-bold">
                {licenses.filter(l => l.status === 'Needs review').length}
              </p>
              <p className="text-yellow-200 text-sm">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-red-300 text-2xl font-bold">
                {licenses.filter(l => {
                  const expiry = parseISO(l.expiryDate);
                  return isAfter(new Date(), expiry);
                }).length}
              </p>
              <p className="text-red-200 text-sm">Expired</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-orange-300 text-2xl font-bold">
                {licenses.filter(l => {
                  const expiry = parseISO(l.expiryDate);
                  const now = new Date();
                  const thirtyDaysFromNow = addDays(now, 30);
                  return isAfter(expiry, now) && !isAfter(expiry, thirtyDaysFromNow);
                }).length}
              </p>
              <p className="text-orange-200 text-sm">Expiring Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Types</option>
            {licenseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Expiry Status</option>
            <option value="valid">Valid (30+ days)</option>
            <option value="expiring-soon">Expiring Soon (30 days)</option>
            <option value="expired">Expired</option>
          </select>

          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search licenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Number</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Issuer</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Issue Date</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Expiry</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLicenses.map((license) => {
                const expiryStatus = getExpiryStatus(license.expiryDate);
                return (
                  <tr key={license.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(license.status)}
                        <div>
                          <div className="text-white font-medium">{license.type}</div>
                          {license.notes && (
                            <div className="text-gray-400 text-sm">{license.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-mono text-sm">{license.number}</td>
                    <td className="py-4 px-6 text-gray-300">{license.issuer}</td>
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      {format(parseISO(license.issueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-white text-sm">
                          {format(parseISO(license.expiryDate), 'MMM d, yyyy')}
                        </div>
                        <div className={`text-xs ${expiryStatus.color}`}>
                          {expiryStatus.text}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs rounded border ${getStatusChip(license.status)}`}>
                        {license.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                        <button className="text-emerald-400 hover:text-emerald-300 text-sm">Edit</button>
                        {expiryStatus.status === 'expiring' || expiryStatus.status === 'expired' ? (
                          <button className="text-yellow-400 hover:text-yellow-300 text-sm">Renew</button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLicenses.length === 0 && (
        <div className="text-center py-12">
          <DocumentCheckIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No licenses found matching your filters.</p>
          <button className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            Upload First License
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <DocumentCheckIcon className="h-5 w-5" />
            <span>Upload New License</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>Review Expiring Soon</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Generate Compliance Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}