import { Card } from '@/components/ui/card';
import { FileText, Download, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const documents = [
  { id: 'doc-1', name: 'Employment Contract.pdf', type: 'Contract', date: '2023-03-15', size: '245 KB' },
  { id: 'doc-2', name: 'NDA Agreement.pdf', type: 'Legal', date: '2023-03-15', size: '128 KB' },
  { id: 'doc-3', name: 'Tax Form W-4.pdf', type: 'Tax', date: '2024-01-10', size: '89 KB' },
  { id: 'doc-4', name: 'Benefits Enrollment.pdf', type: 'Benefits', date: '2023-04-01', size: '156 KB' },
  { id: 'doc-5', name: 'Performance Review 2023.pdf', type: 'Review', date: '2023-12-15', size: '312 KB' },
];

const DocumentsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">View and manage your documents</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="divide-y divide-border">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.date} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DocumentsPage;
