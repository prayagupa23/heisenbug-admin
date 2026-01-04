'use client'

export default function GeographicRisk() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-foreground mb-4">Geographic Risk</h2>
      
      <div className="relative h-48 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Live Feed Inactive</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-destructive rounded-full"></div>
          <span className="text-xs text-muted-foreground">High Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-muted rounded-full"></div>
          <span className="text-xs text-muted-foreground">Normal</span>
        </div>
      </div>
    </div>
  )
}
