-- Create storage bucket for photo uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to photos
CREATE POLICY "Public can view photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'photos');

-- Allow anyone to upload photos (no auth required for this app)
CREATE POLICY "Anyone can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'photos');

-- Allow anyone to delete their photos
CREATE POLICY "Anyone can delete photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'photos');