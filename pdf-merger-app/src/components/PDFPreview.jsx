import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, X, GripVertical } from 'lucide-react'
import './PDFPreview.css'

function SortableItem({ file, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`pdf-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="pdf-item-content">
        <div 
          className="drag-handle"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </div>
        
        <div className="pdf-icon">
          <FileText size={24} />
        </div>
        
        <div className="pdf-info">
          <div className="pdf-name" title={file.name}>
            {file.name}
          </div>
          <div className="pdf-size">
            {formatFileSize(file.size)}
          </div>
        </div>
        
        <button 
          onClick={() => onRemove(file.id)}
          className="remove-btn"
          title="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function PDFPreview({ files, onFileRemove, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex(file => file.id === active.id);
      const newIndex = files.findIndex(file => file.id === over.id);

      onReorder(arrayMove(files, oldIndex, newIndex));
    }
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="pdf-preview">
      <div className="preview-header">
        <p>Drag and drop to reorder files</p>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={files.map(file => file.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pdf-list">
            {files.map((file, index) => (
              <div key={file.id} className="pdf-item-wrapper">
                <div className="item-number">{index + 1}</div>
                <SortableItem 
                  file={file} 
                  onRemove={onFileRemove}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}