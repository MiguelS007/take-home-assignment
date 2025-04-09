export function Footer() {
  return (
    <footer className="footer mt-auto py-6 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          User Management System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
