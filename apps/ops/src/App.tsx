import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PropertiesPage } from './pages/supply/PropertiesPage';
import { VendorsPage } from './pages/supply/VendorsPage';
import { VendorDetailPage } from './pages/supply/VendorDetailPage';
import { PropertyDetailPage } from './pages/supply/PropertyDetailPage';
import { RoomTypesPage } from './pages/supply/RoomTypesPage';
import { RoomTypeEditorPage } from './pages/supply/RoomTypeEditorPage';
import { CalendarPage } from './pages/supply/CalendarPage';
import { RatesPage } from './pages/supply/RatesPage';
import { MediaPage } from './pages/supply/MediaPage';
import { LicensesPage } from './pages/supply/LicensesPage';
import { VendorOnboardingPage } from './pages/supply/VendorOnboardingPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { TripsPage } from './pages/trips/TripsPage';
import { TripLayout } from './pages/trips/TripLayout';
import { TripInfoTab } from './pages/trips/TripInfoTab';
import { ItinerariesTab } from './pages/trips/ItinerariesTab';
import { BatchesTab } from './pages/trips/BatchesTab';
import { TripVendorsTab } from './pages/trips/TripVendorsTab';
import { BatchDetailPage } from './pages/trips/BatchDetailPage';
import { PublicVendorView } from './pages/public/PublicVendorView';
import { PublicWelcomePack } from './pages/public/PublicWelcomePack';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages shared outside the company: no admin chrome */}
        <Route path="/public/vendor/:tripId/:batchId" element={<PublicVendorView />} />
        <Route path="/public/welcome/:tripId/:batchId" element={<PublicWelcomePack />} />

        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/trips" replace />} />
                <Route path="/supply/properties" element={<PropertiesPage />} />
                <Route path="/supply/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/supply/properties/:id/room-types" element={<RoomTypesPage />} />
                <Route path="/supply/properties/:propertyId/room-types/:roomTypeId" element={<RoomTypeEditorPage />} />
                <Route path="/supply/properties/:id/calendar" element={<CalendarPage />} />
                <Route path="/supply/properties/:id/rates" element={<RatesPage />} />
                <Route path="/supply/vendors" element={<VendorsPage />} />
                <Route path="/supply/vendors/:id" element={<VendorDetailPage />} />
                <Route path="/supply/onboarding" element={<VendorOnboardingPage />} />
                <Route path="/supply/media" element={<MediaPage />} />
                <Route path="/supply/licenses" element={<LicensesPage />} />
                <Route path="/property/:id" element={<PropertyDetailsPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trips/:tripId/batches/:batchId" element={<BatchDetailPage />} />
                <Route path="/trips/:tripId" element={<TripLayout />}>
                  <Route index element={<Navigate to="batches" replace />} />
                  <Route path="info" element={<TripInfoTab />} />
                  <Route path="itineraries" element={<ItinerariesTab />} />
                  <Route path="batches" element={<BatchesTab />} />
                  <Route path="vendors" element={<TripVendorsTab />} />
                </Route>
                <Route path="*" element={<p className="text-gray-400">Page not found.</p>} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
