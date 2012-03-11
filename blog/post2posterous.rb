#!/usr/bin/env ruby

# Install Posterous gem before running it via
# gem install posterous
#
# argument should be markdown file
@filename = ARGV.first || " " 


require 'posterous'

# store your personal info : username and API token
# Posterous.config = {...}
load '../config/posterous.rb'

include Posterous

# Check if file exists and opens it
raise ArgumentError, 'Input file '+@filename+' does not exist' unless File.exists?(@filename)
@digest = File.open(@filename)

#Parse line to get post infos
@title = @digest.gets.split(':')[1]
print 'Title is: ' + @title

@tags = @digest.gets.split(':')[1]
print 'Tags are: '+ @tags

#Strip to have exact true/false string
@autopost = @digest.gets.split(':')[1].strip!
puts 'Autopost config is '+ @autopost

@is_private = @digest.gets.split(':')[1].strip!
puts 'Private post: ' + @is_private

# Blank line between config and text
@digest.gets

# Parse text
@text = ""
while line = @digest.gets
  @text = @text+line
end

# Create HTML post to feed posterous
@body = "<p><markdown>\n"+@text+"\n</markdown></p>"

# Enter posterous pwd
puts "Please enter your Posterous Password"
print '> '
#avoid password to be displayed on the console
`stty -echo`
Posterous.config['password'] = STDIN.gets.chomp()
#restore console display
`stty echo`
puts " "

# Post the blog post
@user = User.me
@site = Site.find('needforair')
@post = @site.posts.create(:title => @title, :body => @body, :tags => @tags, :autopost => @autopost, :is_private => @is_private)

puts "Blog post successfully sent to Posterous"
