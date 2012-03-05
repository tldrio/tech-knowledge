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

# Check is file exists and opens it
raise ArgumentError, 'Input file '+@filename+' does not exist' unless File.exists?(@filename)
@digest = File.open(@filename)

#Parse line to get post infos
@title = @digest.gets
print 'Title is: ' + @title
@tags = @digest.gets
print 'Tags are: '+ @tags
#Strip to have exact true/false string
@autopost = @digest.gets.strip!
puts 'Autopost config is '+ @autopost
@is_private = @digest.gets.strip!
puts 'Private post: ' + @is_private

# Blank line between config and text
@digest.gets

# Parse text
@text = ""
while line = @digest.gets
  @text = @text+line
end

# Create HTML post to feed posterous
@body = "<p><markdown>\n"+@text+"\n</p></markdown>"

# Enter posterous pwd
puts "Please enter your Posterous Password"
print '> '
`stty -echo`
Posterous.config['password'] = STDIN.gets.chomp()
`stty echo`
puts " "

# Post the blog post
@user = User.me
@site = Site.find('needforair')
@post = @site.posts.create(:title => @title, :body => @body, :tags => @tags, :autopost => @autopost, :is_private => @is_private)

puts "Blog post successfully sent to Posterous"
