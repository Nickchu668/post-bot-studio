-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;

-- Create secure storage policies that require authentication
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Authenticated users can view photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'photos');

CREATE POLICY "Users can delete their own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update bucket to be private (optional - depends on whether photos need to be publicly viewable)
UPDATE storage.buckets SET public = false WHERE id = 'photos';