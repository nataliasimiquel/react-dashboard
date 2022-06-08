module.exports = function(grunt) {

    // Project configuration.
   grunt.initConfig({
     exec: {
      run_builder: 'CI=false npm run build'
     },  
     aws_s3: {
       options: {
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_API_KEY,
        region: 'sa-east-1',
        uploadConcurrency: 5
        },
       production: {
         options: {
          bucket: process.env.REACT_APP_AWS_BUCKET },
         files: [
           {expand: true, cwd: 'build/', src: ['**/*'], dest: '/', params: {CacheControl: 'no-cache'}}
         ]
       }
     }
   });
  
   grunt.loadNpmTasks('grunt-aws-s3'),
   grunt.loadNpmTasks('grunt-exec');
   // Default task(s).
   grunt.registerTask('default', ['exec','aws_s3']);
 };