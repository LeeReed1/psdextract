var PSD = require("psd");


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  	secret: grunt.file.readJSON('secret.json'),
	psd: {
		src: "./about.psd",
		dest: "./output.png" 	
	},
	sftp: {
	  test: {
	    files: {
	      "./": "*png"
	    },
	    options: {
	      path: '/var/www/html/psdextract/',
	      host: '<%= secret.host %>',
	      username: '<%= secret.username %>',
		  privateKey: grunt.file.read("/Users/fred/.ssh/id_rsa"),
  		  passphrase: "<%= secret.passphrase %>",
	      showProgress: true
	    }
	  }
	},
	watch: {
		files: "./**/*.psd",
		tasks: ["psd", "sftp"],
		options: {
			spawn: false
		}
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ssh');

  // PSD task
  grunt.registerTask('psd', "Extract PNG from PSD", function() {
	  var src = grunt.config.data.psd.src;
	  var dest = grunt.config.data.psd.dest;
	  
	  console.log("Extracting png from " + src + " to " + dest);
	  
	  PSD.open(src).then(function(psd) {
	  	return psd.image.saveAsPng(dest);
	  });
  });

  // Default task(s).
  grunt.registerTask('default', ['psd', 'sftp', 'watch']);

};