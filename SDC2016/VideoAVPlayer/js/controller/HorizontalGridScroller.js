/***********************************************************************
 @ Name: horizontalGridScroller.js
 @ Brief: This file handles functionality for scrolling grid horizontally.
 @ Specification: JavaScript,HTML,CSS
 @ Authoring Tool:SDK
 @ Copyright: 2011 Samsung Electronics, Inc.
 @ Date: 2nd February 2015
 @ Author: Vijaya Lakshmi.
 @ Release Version: 1.0
 @ Note: This software is the confidential and proprietary information
 @ of Samsung Electronics, Inc. (Confidential Information).  You
 @ shall not disclose such Confidential Information and shall use
 @ it only in accordance with the terms of the license agreement
 @ you entered into with Samsung.
 ***********************************************************************/
var horizontalGridScroller=function(containerID, parent, totalItems, maxRow, maxColumn, animationTime, categoryIndex, thumbName, animationCallback, width)
{
	console.log("horizontalGridScroller; 1 called");
	this.mainContainerID = containerID;
	this.totalItems = parseInt(totalItems);
	this.currentItemIndex = 0;
	this.currentRow = 0;
	this.currentColumn = 0;
	this.maxRow = maxRow;
	this.maxColumn = maxColumn;
	this.currentGridFocus = 0;
	this.animationTime=animationTime;
	this.itemDownArrowFlag=true;
	this.itemUpArrowFlag=true;
	this.thumbName=thumbName;
	this.categoryIndex = categoryIndex;
	this.parent = parent;
	this.rightGap = 0;
	this.totalColumn = Math.ceil(this.totalItems/this.maxRow);
	this.width = width;
	if(typeof(animationCallback)== "function")
	{
		this.animationCallback=animationCallback;
		if(this.animationCallback.length==0)
		{
			this.animationCallback=function(str){alert("callback function should except one parameter");};
		}		
	}
	else
	{
		this.animationCallback=function(str){alert("callback function not valid");};
	}
};
/*
 @ method: horizontalGridScroller.prototype.addFocus
 @ description: This function adds focus to the grid.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.addFocus = function()
{
	if($('#thumbFocus').length){
		$('#thumbFocus').remove();
	}
	this.addEffect();
	var parent = $("#"+this.parent);
	parent.append('<div id="thumbFocus"></div>');
	var name = "#"+this.mainContainerID + " #"+this.thumbName + "_" + this.currentRow + "_" + this.currentColumn;
    var leftPos = $(name).offset().left - parent.offset().left;
	if(leftPos == 0){
		leftPos += parseInt($("#"+this.mainContainerID).css("margin-left"));
	}
	$('#thumbFocus').css({'left':leftPos+'px'});
	$('#thumbFocus').css({'top':$(name).offset().top - parent.offset().top});
	this.animationCallback("Focus-Added", name);
};
/*
 @ method: horizontalGridScroller.prototype.setFocus
 @ description: This function sets focus to the grid.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.setFocus = function()
{
	var name = "#"+this.mainContainerID + " #"+this.thumbName + "_" + this.currentRow + "_" + this.currentColumn;
	this.addEffect();
	var parent = $("#"+this.parent);
	$('#thumbFocus').css({'left':$(name).offset().left - parent.offset().left});
	$('#thumbFocus').css({'top':$(name).offset().top - parent.offset().top});
	this.setArrowState();
	this.animationCallback("Focus-Added", name);
};
/*
 @ method: horizontalGridScroller.prototype.removeFocus
 @ description: This function removes focus from the grid.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.removeFocus = function()
{
	if($('#thumbFocus').length){
		$('#thumbFocus').remove();
		var name = "#"+this.mainContainerID + " #"+this.thumbName + "_" + this.currentRow + "_" + this.currentColumn;
		this.animationCallback("Focus-Removed", name);
	}
};

horizontalGridScroller.prototype.addEffect = function()
{
	var container = $("#"+this.mainContainerID);
	var start = parseInt($('#'+this.mainContainerID+' > div:first').children("div:first-child").attr("id").split("_")[2]);
	var end = parseInt($('#'+this.mainContainerID+' > div:last').children("div:last-child").attr("id").split("_")[2]);
	for(var i=0; i<this.maxRow;i++)
	{
		for(var j=start; j<=end; j++)
		{
			var thumbnail = $("#"+this.mainContainerID + " #"+this.thumbName + "_" + i + "_" + j);
			if(i == this.currentRow && j == this.currentColumn)
			{
				thumbnail.removeClass("thumbBlur");
			}
			else if(thumbnail.length > 0 && !thumbnail.hasClass("thumbBlur"))
			{
				thumbnail.addClass("thumbBlur");
			};
		};
	};
};

/*
 @ method: horizontalGridScroller.prototype.removeEffect
 @ description: This function removes effect from the grid element.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.removeEffect = function()
{
	var container = $("#"+this.mainContainerID);
	var start = parseInt($('#'+this.mainContainerID+' > div:first').children("div:first-child").attr("id").split("_")[2]);
	var end = parseInt($('#'+this.mainContainerID+' > div:last').children("div:last-child").attr("id").split("_")[2]);
	for(var i=0; i<this.maxRow;i++)
	{
		for(var j=start; j<=end; j++)
		{
			var thumbnail = $("#"+this.mainContainerID + " #"+this.thumbName + "_" + i + "_" + j);
			if(thumbnail.length > 0)
			{
				thumbnail.removeClass("thumbBlur");
			};
		};
	};
};

/*
 @ method: horizontalGridScroller.prototype.moveLeft
 @ description: This function moves focus left.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.moveLeft=function()
{	
	try
	{
		if(this.currentColumn > 0)
		{
			this.animationCallback("Focus-Removed", ("#"+this.mainContainerID + " #"+this.thumbName + "_" + this.currentRow + "_" + this.currentColumn));
			this.currentColumn--;
			var currentObj = this;
			var thumbFocus = $("#"+this.parent + " #thumbFocus");
			if(this.currentGridFocus == 0)
			{
				//thumbFocus.hide();
				var container = $("#"+this.mainContainerID);
				var totalGridItems = container.children().length - this.maxColumn;
				var start = this.currentColumn-(this.maxColumn-1);
				if(start < 0)
				{
					this.currentGridFocus = this.currentColumn;
					start = 0;
				}
				else
				{
					this.currentGridFocus = this.maxColumn-1;
				}
				//EventHandler.removeListeners();
				var end = container.children("div:first-child").children("div:first-child").attr("id").split("_")[2]-1;
				var prevWidth = container.width();
				this.animationCallback("Left-Start", start, end, this.categoryIndex, this.maxColumn, this.maxRow);
				this.addEffect();
			
				start = (currentObj.currentColumn + currentObj.maxColumn - currentObj.currentGridFocus);
				currentObj.removeExtraColumns(currentObj, start, start+currentObj.maxColumn);
			}
			else
			{
				this.currentGridFocus--;
				this.setFocus();	
			};
		}
		else if(this.currentColumn == 0)
		{
			this.animationCallback("upOnFirstItem");
		}
	}
	catch(ex)
	{
		alert("Error in horizontalGridScroller's 'moveLeft' function :::: " + ex);
	}	
};
/*
 @ method: horizontalGridScroller.prototype.moveRight
 @ description: This function moves focus right.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.moveRight=function()
{	
	try
	{
		if((this.currentColumn < this.totalColumn-1) && this.isInRange(this.currentRow, (this.currentColumn+1)))// && $("#"+this.mainContainerID + " #"+this.thumbName + "_" + this.currentRow +"_"+(this.currentColumn+1)).length > 0)
		{
			console.log("Inside if");
			this.currentColumn++;
			if(this.currentGridFocus < (this.maxColumn-1))
			{
				console.log("Inside if 1");
				this.currentGridFocus++;
				this.setFocus();
			}
			else
			{
				//EventHandler.removeListeners();
				console.log("Else ");
				var thumbFocus = $("#"+this.parent + " #thumbFocus");
				//thumbFocus.hide();
				var currentObj = this;
				var container = $("#"+this.mainContainerID);
				var columnsLeft = this.totalColumn - this.currentColumn;
				this.currentGridFocus = (this.maxColumn - columnsLeft);
				if(columnsLeft <= this.maxColumn)
				{		
					console.log("Else if");
					this.animationCallback("Right-Start", this.currentColumn, this.totalColumn-1, this.categoryIndex, this.maxColumn, this.maxRow);	
					currentObj.removeExtraColumns(currentObj, (currentObj.currentColumn-currentObj.maxColumn), (currentObj.currentColumn-this.currentGridFocus));
					this.addEffect();
					var parentLeft = container.width() - ($("#"+this.parent).width() - this.rightGap);
				}
				else
				{
					console.log("Else if else");
					this.currentGridFocus = 0;
					this.animationCallback("Right-Start", this.currentColumn, this.currentColumn+this.maxColumn-1, this.categoryIndex, this.maxColumn, this.maxRow);					
					var scrollTo = $('#'+this.mainContainerID + ' #'+this.thumbName+"_"+this.currentRow + "_"+this.currentColumn);
					container.animate({left: (container.position().left - scrollTo.position().left)}, this.animationTime, function() {
						currentObj.removeExtraColumns(currentObj, (currentObj.currentColumn-currentObj.maxColumn), currentObj.currentColumn);
						container.css({left:scrollTo.position().left});
						currentObj.setFocus();
						thumbFocus.show();
						currentObj.animationCallback("Right-Finish");
					});
				};
			};
		};
	}
	catch(ex)
	{
		alert("Error in horizontalGridScroller's 'moveRight' function :::: " + ex);
	};	
};
/*
 @ method: horizontalGridScroller.prototype.moveUp
 @ description: This function moves focus to up.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.moveUp=function()
{	
	try
	{
		if(this.currentRow > 0  && ($("#"+this.mainContainerID + " #"+this.thumbName + "_" + (this.currentRow-1) +"_"+this.currentColumn).css("visibility") != "hidden"))
		{
			this.currentRow--;
			this.setFocus();
		}
	}
	catch(ex)
	{
		alert("Error in horizontalGridScroller's 'moveUp' function :::: " + ex);
	}	
};
/*
 @ method: horizontalGridScroller.prototype.moveDown
 @ description: This function moves focus to down.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.moveDown=function()
{	
	try
	{
		if(this.currentRow < this.maxRow-1 && ($("#"+this.mainContainerID + " #"+this.thumbName + "_" + (this.currentRow+1) +"_"+this.currentColumn).css("visibility") != "hidden"))
		{
			this.currentRow++;
			this.setFocus();
		}
	}
	catch(ex)
	{
		alert("Error in horizontalGridScroller's 'moveDown' function :::: " + ex);
	}	
};
/*
 @ method: horizontalGridScroller.prototype.removeExtraColumns
 @ description: This function removes extra columns of the grid.
 @ param: currentObj
 @ param: startColumn
 @ param: endColumn
 @ return: none
 */
horizontalGridScroller.prototype.removeExtraColumns = function(currentObj, startColumn, endColumn)
{
	var container = $("#"+this.mainContainerID);
	for(var i=0; i<currentObj.maxRow; i++)
	{
		for(var j=startColumn; j<endColumn; j++)
		{
			var thumbnail = $('#'+currentObj.mainContainerID + ' #'+currentObj.thumbName +"_"+i +"_"+ j);
			if(thumbnail.length > 0)
			{
				if(i==0)
				{
					var thumbParent = $(thumbnail).parent();
					if(thumbParent.width() <= currentObj.width)
					{
						thumbParent.remove();
						container.width(container.width()-currentObj.width);
					}
					else
					{
						thumbParent.width(thumbParent.width()-currentObj.width);
						container.width(container.width()-currentObj.width);
					}
				}
				thumbnail.remove();
			};
		};
	};
};
/*
 @ method: horizontalGridScroller.prototype.setArrowState
 @ description: This function updates arrow state
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.setArrowState=function()
{
	var url = (this.currentColumn == 0) ? 'url(images/left-arrow-normal.png)' : 'url(images/left-arrow-focus.png)';
	$("#leftArrow"+this.categoryIndex).css({'background-image':url});
	url = (this.currentColumn == this.totalColumn - 1) ? 'url(images/right-arrow-normal.png)' : 'url(images/right-arrow-focus.png)';
	$("#rightArrow"+this.categoryIndex).css({'background-image':url});	
};
/*
 @ method: roundFloatValue
 @ description: This function rounds up decimanl value.
 @ param: number
 @ param: decimalPoint
 @ return: outPut
 */
function roundFloatValue(number, decimalPoint) {
	var outPut = Math.round(number*Math.pow(10,decimalPoint))/Math.pow(10,decimalPoint);
	return outPut;
}
/*
 @ method: horizontalGridScroller.prototype.getTotalItems
 @ description: This function returns count of items.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.getTotalItems=function()
{
	return this.totalItems;
};
/*
 @ method: horizontalGridScroller.prototype.getSelectedItemIndex
 @ description: This function returns current selected item index.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.isInRange=function(row, col)
{	
	//var index = (Math.floor(col/this.maxColumn)*this.maxColumn*(this.maxRow-1)) + (row*this.maxColumn + col);
	var index = row + this.maxRow*col;
	return (index < this.totalItems);
};
/*
 @ method: horizontalGridScroller.prototype.getSelectedItemIndex
 @ description: This function returns current selected item index.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.getSelectedItemIndex=function()
{	
	//return (Math.floor(this.currentColumn/this.maxColumn)*this.maxColumn*(this.maxRow-1)) + (this.currentRow*this.maxColumn + this.currentColumn);
	return (this.currentRow + this.maxRow*this.currentColumn);
};
/*
 @ method: horizontalGridScroller.prototype.setRightGap
 @ description: This function sets right gap.
 @ param: bottomGap
 @ return: none
 */
horizontalGridScroller.prototype.setRightGap=function(rightGap)
{
	this.rightGap = rightGap
};
/*
 @ method: horizontalGridScroller.prototype.deleteThis
 @ description: This function deletes unused property.
 @ param: none
 @ return: none
 */
horizontalGridScroller.prototype.deleteThis=function()
{
	try
	{
		for (prop in this)
		{
			if (this.hasOwnProperty(prop)) 
			{ 
				delete this[prop]; 
			} 
		}
	}
	catch(ex)
	{
		alert("Error in horizontalGridScroller's 'deleteThis' function :::: " + ex);
	}
};
